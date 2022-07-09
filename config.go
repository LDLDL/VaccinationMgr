package main

type ConfigSite struct {
	Listen string `toml:"listen"`
	Static string `toml:"static"`
}

type ConfigDatabase struct {
	Addr     string `toml:"postgre_url"`
	User     string `toml:"user"`
	Password string `toml:"password"`
	Database string `toml:"db_name"`
}

type ConfigSecurity struct {
	Salt          string `toml:"salt"`
	HMAC          string `toml:"hmac"`
	AdminPassword string `toml:"admin_password"`
	AdminPassHash []byte `toml:"-"`
}

type ConfigHttps struct {
	Cert string `toml:"cert"`
	Key  string `toml:"key"`
}

type Config struct {
	Site     ConfigSite     `toml:"site"`
	DB       ConfigDatabase `toml:"db"`
	Security ConfigSecurity `toml:"security"`
	Https    ConfigHttps    `toml:"https"`
}

func (c *Config) SetDefault() {
	c.Site.Listen = ":8080"
	c.Site.Static = "./static"

	c.DB.Addr = ":5432"
	c.DB.User = "postgres"
	c.DB.Password = ""
	c.DB.Database = "ym"

	c.Security.Salt = "salt"
	c.Security.HMAC = "hmac"
	c.Security.AdminPassword = "adminadmin"

	c.Https.Cert = ""
	c.Https.Key = ""
}