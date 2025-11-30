# Terraform

## 構成

- `providers.tf`: Cloudflare provider設定
- `variables.tf`: 必要変数(API Token, Account ID, room prefixなど)

## 使い方 (初期)

1. 変数用 `terraform.tfvars` を作成

```
cloudflare_api_token   = "<token>"
cloudflare_account_id  = "<account_id>"
```

2. terraform backend用`s3.tfbackend`を`example.tfbackend`を元に作成

3. 初期化 & 生成

```
terraform init
terraform plan
terraform apply
```
