variable "ssh_public_key" {
  description = "Public SSH key for EC2 access"
  type        = string
}

variable "api_url" {
  description = "URL of the external API the frontend will call"
  type        = string
  sensitive   = true
}