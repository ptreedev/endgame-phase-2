output "static_public_ip" {
  description = "The permanent Elastic IP of the frontend EC2 instance"
  value       = aws_eip.frontend_eip.public_ip
}

output "app_url" {
  description = "The URL to access the frontend"
  value       = "http://${aws_eip.frontend_eip.public_ip}"
}