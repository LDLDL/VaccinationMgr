package main

import (
	"crypto/subtle"
	"github.com/go-pg/pg/v10"
	"log"
)

func PersonExist(IDNumber string) (bool, SErr) {
	err := db.Model(&Person{}).Where("id_number = ?", IDNumber).Select()

	if err == pg.ErrNoRows {
		return false, EOK
	} else if err != nil {
		log.Printf("[Warn] Failed checking user named `%s` exist: %s\n", IDNumber, err)
		return false, EUnknown
	}

	return true, EOK
}

func VaccinationSiteAdminExist(Account string) (bool, SErr) {
	sa := &VaccinationSiteAdmin{}

	err := db.Model(sa).Where("account = ?", Account).Select()

	if err == pg.ErrNoRows {
		return false, EOK
	} else if err != nil {
		log.Printf("[Warn] Failed checking vaccination site admin `%s` exist: %s\n", Account, err)
		return false, EUnknown
	}

	return true, EOK
}

type RegisterQ struct {
	Name        string `json:"name"         binding:"required"`
	Password    string `json:"password"     binding:"required"`
	IDNumber    string `json:"id_number"    binding:"required"`
	Sex         string `json:"sex"          binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	Birthday    int64  `json:"birthday"     binding:"required"`
}

func Register(r *RegisterQ) SErr {
	e, serr := PersonExist(r.IDNumber)

	if serr != EOK {
		return serr
	}

	if e {
		return EPersonExist
	}

	p := &Person{
		IDNumber:    r.IDNumber,
		PassHash:    PasswordHash(r.Password),
		Name:        r.Name,
		Birthday:    r.Birthday,
		Sex:         r.Sex,
		PhoneNumber: r.PhoneNumber,
	}

	_, err := db.Model(p).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type LoginPersonQ struct {
	IDNumber string `json:"id_number" binding:"required"`
	Password string `json:"password"  binding:"required"`
}

func LoginPerson(r *LoginPersonQ) (*Person, SErr) {
	p := &Person{}

	err := db.Model(p).Where("id_number = ?", r.IDNumber).Select()
	if err == pg.ErrNoRows {
		return nil, EBadCredential
	} else if err != nil {
		log.Printf("[Warn] Failed checking if user `%s` exist: %s\n", r.IDNumber, err)
		return nil, EUnknown
	}

	if subtle.ConstantTimeCompare(PasswordHash(r.Password), p.PassHash) == 0 {
		return nil, EBadCredential
	}

	return p, EOK
}

type AddSiteAdminQ struct {
	Name              string `json:"name"                binding:"required"`
	Account           string `json:"account"             binding:"required"`
	Phone             string `json:"phone"               binding:"required"`
	Password          string `json:"password"            binding:"required"`
	VaccinationSiteID int    `json:"vaccination_site_id" binding:"required"`
}

func AddSiteAdmin(r *AddSiteAdminQ) SErr {
	e, serr := VaccinationSiteAdminExist(r.Account)

	if serr != EOK {
		return serr
	}

	if e {
		return EPersonExist
	}

	sa := &VaccinationSiteAdmin{
		Name:              r.Name,
		Account:           r.Account,
		Phone:             r.Phone,
		PassHash:          PasswordHash(r.Password),
		VaccinationSiteID: r.VaccinationSiteID,
	}

	_, err := db.Model(sa).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type LoginSiteAdminQ struct {
	Account  string `json:"account"  binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginSiteAdmin(r *LoginSiteAdminQ) (*VaccinationSiteAdmin, SErr) {
	sa := &VaccinationSiteAdmin{}

	err := db.Model(sa).Relation("VaccinationSite").Where("account = ?", r.Account).Select()
	if err == pg.ErrNoRows {
		return nil, EBadCredential
	} else if err != nil {
		log.Printf("[Warn] Failed checking if vaccination site admin `%s` exist: %s\n", sa.Account, err)
		return nil, EUnknown
	}

	if subtle.ConstantTimeCompare(PasswordHash(r.Password), sa.PassHash) == 0 {
		return nil, EBadCredential
	}

	return sa, EOK
}

type LoginAdminQ struct {
	Password string `json:"password" binding:"required"`
}

func LoginAdmin(r *LoginAdminQ) SErr {
	if subtle.ConstantTimeCompare(PasswordHash(r.Password), config.Security.AdminPassHash) == 0 {
		return EBadCredential
	}

	return EOK
}

type ChangePasswordQ struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

func ChangePasswordPerson(r *ChangePasswordQ, p *Person) SErr {
	if subtle.ConstantTimeCompare(PasswordHash(r.OldPassword), p.PassHash) == 0 {
		return EBadCredential
	}

	np := &Person{
		IDNumber:    p.IDNumber,
		PassHash:    PasswordHash(r.NewPassword),
		Name:        p.Name,
		Birthday:    p.Birthday,
		Sex:         p.Sex,
		PhoneNumber: p.PhoneNumber,
	}

	_, err := db.Model(np).WherePK().Update()
	if err != nil {
		log.Printf("[Warn] Failed updating password of `%s`: %s\n", p.Name, err)
		return EUnknown
	}

	return EOK
}

type ChangeProfileQ struct {
	Name        string `json:"name"         binding:"required"`
	Sex         string `json:"sex"          binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	Birthday    int64  `json:"birthday"     binding:"required"`
}

func ChangeProfile(r *ChangeProfileQ, p *Person) SErr {

	np := &Person{
		IDNumber:    p.IDNumber,
		PassHash:    p.PassHash,
		Name:        r.Name,
		Sex:         r.Sex,
		PhoneNumber: r.PhoneNumber,
		Birthday:    r.Birthday,
	}

	_, err := db.Model(np).WherePK().Update()
	if err != nil {
		log.Printf("[Warn] Failed updating profile of `%s`: %s\n", p.Name, err)
		return EUnknown
	}

	return EOK
}

type RemoveSiteAdminQ struct {
	Account string `json:"account" binding:"required"`
}

func RemoveSiteAdmin(r *RemoveSiteAdminQ) SErr {
	_, err := db.Model((*VaccinationSiteAdmin)(nil)).Where("account = ?", r.Account).Delete()
	if err != nil {
		log.Printf("[Warn] Failed deleting site admin of `%s`: %s\n", r.Account, err)
		return EUnknown
	}

	return EOK
}

type ListSiteAdminsP struct {
	Admins []VaccinationSiteAdmin `json:"admins"`
}

func ListSiteAdmins(sid int) (*ListSiteAdminsP, SErr) {
	var admins []VaccinationSiteAdmin
	err := db.Model(&admins).Where("vaccination_site_id = ?", sid).Select()
	if err != nil {
		return nil, EUnknown
	}

	return &ListSiteAdminsP{Admins: admins}, EOK
}

type SetSiteAdminPasswordQ struct {
	Account  string `json:"account"  binding:"required"`
	Password string `json:"password" binding:"required"`
}

func SetSiteAdminPassword(r *SetSiteAdminPasswordQ) SErr {
	sa := &VaccinationSiteAdmin{}

	err := db.Model(sa).Where("account = ?", r.Account).Select()
	if err != nil {
		return EUserNotExist
	}

	sa.PassHash = PasswordHash(r.Password)

	_, err = db.Model(sa).WherePK().Update()
	if err != nil {
		log.Printf("[Warn] Failed updating site admin password of `%s`: %s\n", r.Account, err)
		return EUnknown
	}

	return EOK
}

func RemovePerson(idNumber string) SErr {
	_, err := db.Model((*Person)(nil)).Where("id_number = ?", idNumber).Delete()
	if err != nil {
		log.Printf("[Warn] Failed deleting person of `%s`: %s", idNumber, err)
		return EUnknown
	}

	return EOK
}

func GetPerson(idNumber string) (*Person, SErr) {
	p := &Person{}

	err := db.Model(p).Where("id_number = ?", idNumber).Select()
	if err != nil {
		return nil, EUserNotExist
	}

	return p, EOK
}

type SetPersonPasswordQ struct {
	IDNumber string `json:"id_number" binding:"required"`
	Password string `json:"password"  binding:"required"`
}

func SetPersonPassword(r *SetPersonPasswordQ) SErr {
	p := &Person{}

	err := db.Model(p).Where("id_number = ?", r.IDNumber).Select()
	if err != nil {
		return EUserNotExist
	}

	p.PassHash = PasswordHash(r.Password)

	_, err = db.Model(p).WherePK().Update()
	if err != nil {
		log.Printf("[Warn] Failed updating person password of `%s`: %s\n", r.IDNumber, err)
		return EUnknown
	}

	return EOK
}

func PhoneNumberExist(phoneNumber string) (bool, SErr) {
	err := db.Model(&Person{}).Where("phone_number = ?", phoneNumber).Select()

	if err == pg.ErrNoRows {
		return false, EOK
	} else if err != nil {
		log.Printf("[Warn] Failed checking phone number `%s` exist: %s\n", phoneNumber, err)
		return false, EUnknown
	}

	return true, EOK
}
