#!/usr/bin/python3

import secrets

secret_key = secrets.token_hex(32)  # 32 bytes -> 64 hex characters
print(secret_key)
