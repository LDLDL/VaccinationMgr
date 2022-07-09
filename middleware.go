package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"log"
	"strconv"
	"time"
)

type UserType int

const (
	PersonUT = UserType(iota)
	SiteAdminUT
	AdminUT

	UnknownUT = UserType(9999)
)

func (ut UserType) MarshalJSON() ([]byte, error) {
	return json.Marshal(fmt.Sprintf("%04d", int(ut)))
}

func (ut *UserType) UnmarshalJSON(b []byte) error {
	if len(b) != 6 {
		return errors.New("bad UserType code: invalid length")
	}

	i, e := strconv.Atoi(string(b)[1:5])

	if e != nil {
		return fmt.Errorf("bad UserType code: %s", e)
	}

	*ut = UserType(i)
	return nil
}

func CreateJWTPerson(p *Person) (string, error) {
	now := time.Now()
	claims := UserJWT{
		Name:     p.Name,
		UserType: PersonUT,
		StandardClaims: jwt.StandardClaims{
			Id:        p.IDNumber,
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(24 * time.Hour).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.Security.HMAC))
}

func CreateJWTSiteAdmin(a *VaccinationSiteAdmin) (string, error) {
	now := time.Now()
	claims := UserJWT{
		Name:     a.Name,
		UserType: SiteAdminUT,
		StandardClaims: jwt.StandardClaims{
			Id:        a.Account,
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(24 * time.Hour).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.Security.HMAC))
}

func CreateJWTAdmin() (string, error) {
	now := time.Now()
	claims := UserJWT{
		Name:     "admin",
		UserType: AdminUT,
		StandardClaims: jwt.StandardClaims{
			Id:        "admin",
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(24 * time.Hour).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.Security.HMAC))
}

func JWTRetrieve() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("jwtError", EOK)
		c.Set("userType", UnknownUT)
		auth := c.Request.Header.Get("Authorization")

		if auth == "" {
			c.Set("user", nil)
			c.Set("jwtError", EMissingAuthorization)
			return
		}

		token, err := jwt.ParseWithClaims(auth, &UserJWT{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(config.Security.HMAC), nil
		})

		if err != nil {
			c.Set("user", nil)
			c.Set("jwtError", EBadCredential)
			return
		}

		claims, ok := token.Claims.(*UserJWT)

		if !ok {
			c.Set("user", nil)
			c.Set("jwtError", EBadCredential)
			return
		}

		if !token.Valid {
			c.Set("user", nil)
			c.Set("jwtError", ECredentialExpired)
			return
		}

		c.Set("userType", claims.UserType)
		if claims.UserType == PersonUT {
			p := &Person{}

			err := db.Model(p).Where("id_number = ?", claims.StandardClaims.Id).Select()
			if err != nil {
				c.Set("user", nil)
				c.Set("jwtError", EBadCredential)
				return
			}
			c.Set("user", p)
		} else if claims.UserType == SiteAdminUT {
			sa := &VaccinationSiteAdmin{}

			err := db.Model(sa).Where("account = ?", claims.StandardClaims.Id).Select()
			if err != nil {
				c.Set("user", nil)
				c.Set("jwtError", EBadCredential)
				return
			}

			c.Set("user", sa)
		} else if claims.UserType == AdminUT {
			if claims.StandardClaims.Id != "admin" {
				c.Set("user", nil)
				c.Set("jwtError", EBadCredential)
				return
			}

			c.Set("user", nil)
		}
	}
}

func personAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ut, exist := c.Get("userType")
		if !exist {
			log.Println("[Warn] personAuth appeared without JWTRetrieve.")
			jsonResult(c, EUnknown)
			c.Abort()
			return
		} else if userType, ok := ut.(UserType); !ok {
			erri, exist := c.Get("jwtError")
			var err SErr
			if !exist {
				err = EUnknown
			} else {
				err = erri.(SErr)
			}
			jsonResult(c, err)
			c.Abort()
			return
		} else {
			if userType == UnknownUT {
				jsonResult(c, EPermissionDenied)
				c.Abort()
				return
			}
		}
	}
}

func siteAdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ut, exist := c.Get("userType")
		if !exist {
			log.Println("[Warn] siteAdminAuth appeared without JWTRetrieve.")
			jsonResult(c, EUnknown)
			c.Abort()
			return
		} else if userType, ok := ut.(UserType); !ok {
			erri, exist := c.Get("jwtError")
			var err SErr
			if !exist {
				err = EUnknown
			} else {
				err = erri.(SErr)
			}
			jsonResult(c, err)
			c.Abort()
			return
		} else {
			if (userType != SiteAdminUT) && (userType != AdminUT) {
				jsonResult(c, EPermissionDenied)
				c.Abort()
				return
			}
		}
	}
}

func adminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		ut, exist := c.Get("userType")
		if !exist {
			log.Println("[Warn] adminAuth appeared without JWTRetrieve.")
			jsonResult(c, EUnknown)
			c.Abort()
			return
		} else if userType, ok := ut.(UserType); !ok {
			erri, exist := c.Get("jwtError")
			var err SErr
			if !exist {
				err = EUnknown
			} else {
				err = erri.(SErr)
			}
			jsonResult(c, err)
			c.Abort()
			return
		} else {
			if userType != AdminUT {
				jsonResult(c, EPermissionDenied)
				c.Abort()
				return
			}
		}
	}
}
