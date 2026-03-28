output "repository_url" {
  description = "URL of the repository"
  value       = aws_ecr_repository.image-repository.repository_url
}

output "arn" {
  description = "arn of the repository"
  value       = aws_ecr_repository.image-repository.arn
}

output "access_key_id_github_actions" {
  description = "Access key ID for Github Actions"
  value       = aws_iam_access_key.github-actions.id
}


output "access_key_secret_github_actions" {
  description = "Access key secret for Github Actions"
  value       = aws_iam_access_key.github-actions.secret
  sensitive   = true
}
