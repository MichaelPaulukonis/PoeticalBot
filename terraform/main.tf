terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Reference to existing common-corpus layer
data "aws_lambda_layer_version" "common_corpus_layer" {
  layer_name = "common-corpus-layer-dev"
  version    = 1
}

# Lambda function
resource "aws_lambda_function" "poeticalbot" {
  filename         = "poeticalbot-lambda.zip"
  function_name    = "poeticalbot"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("poeticalbot-lambda.zip")
  runtime         = "nodejs22.x"
  timeout         = 30

  layers = ["arn:aws:lambda:us-east-1:129701576546:layer:common-corpus-layer-dev:1"]

  environment {
    variables = {
      CONSUMER_KEY    = var.consumer_key
      CONSUMER_SECRET = var.consumer_secret
      TOKEN          = var.token
      TOKEN_SECRET   = var.token_secret
      POST_LIVE      = var.post_live
    }
  }
}

# EventBridge rule for scheduling
resource "aws_cloudwatch_event_rule" "poeticalbot_schedule" {
  name                = "poeticalbot-schedule"
  description         = "Trigger poeticalbot Lambda"
  schedule_expression = "rate(1 hour)" # Adjust as needed
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.poeticalbot_schedule.name
  target_id = "TargetLambdaFunction"
  arn       = aws_lambda_function.poeticalbot.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.poeticalbot.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.poeticalbot_schedule.arn
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "poeticalbot-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}