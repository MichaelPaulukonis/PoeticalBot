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

# Lambda Layer for common-corpus
resource "aws_lambda_layer_version" "common_corpus_layer" {
  filename         = "common-corpus-layer.zip"
  layer_name       = "common-corpus-layer"
  source_code_hash = filebase64sha256("common-corpus-layer.zip")

  compatible_runtimes = ["nodejs18.x"]
  description         = "Common corpus data for poetry generation"
}

# Lambda function
resource "aws_lambda_function" "poeticalbot" {
  filename         = "poeticalbot-lambda.zip"
  function_name    = "poeticalbot"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("poeticalbot-lambda.zip")
  runtime         = "nodejs18.x"
  timeout         = 30

  layers = [aws_lambda_layer_version.common_corpus_layer.arn]

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