terraform {
  required_version = ">= 1.14.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }

  # tfstateの保存先の設定。R2 Storageを使用する。
  # endpoints.s3, bucketは`-backend-config="s3.tfbackend"`で指定する。
  backend "s3" {
    key                         = "terraform.tfstate"
    # regionは必須項目だが、R2はリージョン概念がないため適当な値を入れる。
    region                      = "us-east-1"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

provider "cloudflare" {
  api_token  = var.cloudflare_api_token
}
