package main

import (
	"github.com/dgrijalva/jwt-go"
)

type Vaccine struct {
	ID           int    `json:"id"`
	Type         string `json:"type"`
	Manufacturer string `json:"manufacturer"`
	Location     string `json:"location"`
}

type Person struct {
	// 身份证号作为主键，不用自动生成的id
	IDNumber    string     `pg:",pk"     json:"id_number"`
	PassHash    []byte     `             json:"-"`
	Name        string     `             json:"name"`
	Birthday    int64      `             json:"birthday"`
	Sex         string     `             json:"sex"`
	PhoneNumber string     `pg:",unique" json:"phone_number"`
}

type VaccinationSite struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Address  string `json:"address"`
	Province string `json:"province"`
	City     string `json:"city"`
	District string `json:"district"`
}

type VaccinationSiteAdmin struct {
	Name              string           `                 json:"name"`
	Account           string           `pg:",pk"         json:"account"`
	Phone             string           `                 json:"phone"`
	PassHash          []byte           `                 json:"-"`
	VaccinationSiteID int              `                 json:"vaccination_site_id"`
	VaccinationSite   *VaccinationSite `pg:"rel:has-one" json:"vaccination_site"`
}

type VaccineInventory struct {
	VaccineID         int            `                 json:"vaccine_id"`
	VaccinationSiteID int            `                 json:"vaccination_site_id"`
	Number            int            `                 json:"number"`
	Vaccine         *Vaccine         `pg:"rel:has-one" json:"vaccine"`
	VaccinationSite *VaccinationSite `pg:"rel:has-one" json:"vaccination_site"`
}

type VaccinationLog struct {
	ID                int              `                   json:"id"`
	VaccinationSiteID int              `                   json:"vaccination_site_id"`
	VaccinationSite   *VaccinationSite `pg:"rel:has-one"   json:"vaccination_site"`
	PersonIDNumber    string           `                   json:"person_id_number"`
	Person            *Person          `pg:"rel:has-one"   json:"person"`
	VaccineID         int              `                   json:"vaccine_id"`
	Vaccine           *Vaccine         `pg:"rel:has-one"   json:"vaccine"`
	Time              int64            `                   json:"time"`
	// 疫苗的第几针
	VaccinationTimes  int              `                   json:"vaccination_times"`
}

type VaccinationAppointment struct {
	ID                int              `                 json:"id"`
	PersonIDNumber    string           `                 json:"person_id_number"`
	Person            *Person          `pg:"rel:has-one" json:"person"`
	VaccinationSiteID int              `                 json:"vaccination_site_id"`
	VaccinationSite   *VaccinationSite `pg:"rel:has-one" json:"vaccination_site"`
	VaccineID         int              `                 json:"vaccine_id"`
	Vaccine           *Vaccine         `pg:"rel:has-one" json:"vaccine"`
	Date              int64            `                 json:"date"`
	AppointmentID     int              `                 json:"appointment_id"`
	Vaccination       bool             `pg:",use_zero"   json:"vaccination"`
}

type AppointmentArrangement struct {
	VaccinationSiteID int        `                 json:"vaccination_site_id"`
	Date              int64      `                 json:"date"`
	VaccineID         int        `                 json:"vaccine_id"`
	Vaccine           *Vaccine   `pg:"rel:has-one" json:"vaccine"`
	TotalNumber       int        `                 json:"total_number"`
	BookedNumber      int        `pg:",use_zero"   json:"booked_number"`
	BookID            int        `pg:",use_zero"   json:"-"`
}

type UserJWT struct {
	Name     string   `json:"name"`
	UserType UserType `json:"user_type"`
	jwt.StandardClaims
}
