package main

import (
	"golang.org/x/crypto/scrypt"
)

func PasswordHash(password string) []byte {
	h, _ := scrypt.Key([]byte(password), []byte(config.Security.Salt), 32768, 8, 1, 32)
	return h
}