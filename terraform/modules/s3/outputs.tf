output "access_key_id_github_actions" {
  description = "Access key ID for Github Actions (S3 CloudFront)"
  value       = aws_iam_access_key.github-actions.id
}


output "access_key_secret_github_actions" {
  description = "Access key secret for Github Actions (S3 cloudfront)"
  value       = aws_iam_access_key.github-actions.secret
  sensitive   = true
}
