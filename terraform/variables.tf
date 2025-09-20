variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "consumer_key" {
  description = "Tumblr consumer key"
  type        = string
  sensitive   = true
}

variable "consumer_secret" {
  description = "Tumblr consumer secret"
  type        = string
  sensitive   = true
}

variable "token" {
  description = "Tumblr access token"
  type        = string
  sensitive   = true
}

variable "token_secret" {
  description = "Tumblr token secret"
  type        = string
  sensitive   = true
}

variable "post_live" {
  description = "Whether to post live to Tumblr"
  type        = string
  default     = "true"
}