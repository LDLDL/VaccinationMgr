package main

import (
	"github.com/go-pg/pg/v10"
)

type AddSiteQ struct {
	Name     string `json:"name"     binding:"required"`
	Address  string `json:"address"  binding:"required"`
	Province string `json:"province" binding:"required"`
	City     string `json:"city"     binding:"required"`
	District string `json:"district" binding:"required"`
}

func AddSite(r *AddSiteQ) SErr {
	site := &VaccinationSite{
		Name:     r.Name,
		Address:  r.Address,
		Province: r.Province,
		City:     r.City,
		District: r.District,
	}

	_, err := db.Model(site).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type SetSiteQ struct {
	ID       int    `json:"id"       binding:"required"`
	Name     string `json:"name"     binding:"required"`
	Address  string `json:"address"  binding:"required"`
	Province string `json:"province" binding:"required"`
	City     string `json:"city"     binding:"required"`
	District string `json:"district" binding:"required"`
}

func SetSite(r *SetSiteQ) SErr {
	site := &VaccinationSite{
		ID:       r.ID,
		Name:     r.Name,
		Address:  r.Address,
		Province: r.Province,
		City:     r.City,
		District: r.District,
	}

	_, err := db.Model(site).WherePK().Update()
	if err != nil {
		return EUnknown
	}

	return EOK
}

func GetSite(sid int) (*VaccinationSite, SErr) {
	site := &VaccinationSite{}
	err := db.Model(site).Where("id = ?", sid).Select()
	if err != nil {
		return nil, EUnknown
	}

	return site, EOK
}

func RemoveSite(sid int) SErr {
	_, err := db.Model((*VaccinationSite)(nil)).Where("id = ?", sid).Delete()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type ListSitesQ struct {
	Province string `json:"province" binding:"required"`
	City     string `json:"city"`
	District string `json:"district"`
}

type ListSitesP struct {
	VaccinationSites []VaccinationSite `json:"vaccination_sites"`
}

func ListSites(r *ListSitesQ) (*ListSitesP, SErr) {
	var s []VaccinationSite
	if r.City == "" {
		err := db.Model(&s).
			Where("province = ?", r.Province).
			Select()
		if err != nil {
			return nil, EUnknown
		}
		return &ListSitesP{VaccinationSites: s}, EOK
	} else if r.District == "" {
		err := db.Model(&s).
			Where("province = ?", r.Province).
			Where("city = ?", r.City).
			Select()
		if err != nil {
			return nil, EUnknown
		}
		return &ListSitesP{VaccinationSites: s}, EOK
	} else {
		err := db.Model(&s).
			Where("province = ?", r.Province).
			Where("city = ?", r.City).
			Where("district = ?", r.District).
			Select()
		if err != nil {
			return nil, EUnknown
		}
		return &ListSitesP{VaccinationSites: s}, EOK
	}
}

func ListAllSites() (*ListSitesP, SErr) {
	var s []VaccinationSite

	err := db.Model(&s).Select()
	if err != nil {
		return nil, EUnknown
	}

	return &ListSitesP{VaccinationSites: s}, EOK
}

type ListInventoriesP struct {
	Inventories []VaccineInventory `json:"inventories"`
}

func ListInventoriesSite(siteID int) (*ListInventoriesP, SErr) {
	var inv []VaccineInventory

	err := db.Model(&inv).
		Relation("Vaccine").
		Relation("VaccinationSite").
		Where("vaccination_site_id = ?", siteID).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &ListInventoriesP{Inventories: inv}, EOK
}

type AddInventoriesQ struct {
	VaccineID int `json:"vaccine_id" binding:"required"`
	Number    int `json:"number"     binding:"required"`
}

func AddInventories(r *AddInventoriesQ, siteID int) SErr {
	err := db.Model(&VaccineInventory{}).
		Where("vaccine_id = ?", r.VaccineID).
		Where("vaccination_site_id = ?", siteID).
		Select()

	if err == nil {
		return EInventoryExist
	} else if err != pg.ErrNoRows {
		return EUnknown
	}

	inv := &VaccineInventory{
		VaccineID:         r.VaccineID,
		VaccinationSiteID: siteID,
		Number:            r.Number,
	}

	_, err = db.Model(inv).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

func RemoveInventories(vaccineID int, vaccinationSiteID int) SErr {
	_, err := db.Model((*VaccineInventory)(nil)).
		Where("vaccine_id = ?", vaccineID).
		Where("vaccination_site_id = ?", vaccinationSiteID).
		Delete()

	if err != nil {
		return EUnknown
	}

	return EOK
}

type SetInventoriesQ struct {
	VaccineID int `json:"vaccine_id" binding:"required"`
	Number    int `json:"number"     binding:"required"`
}

func SetInventories(r *SetInventoriesQ, siteID int) SErr {
	inv := &VaccineInventory{}

	_, err := db.Model(inv).
		Set("number = ?", r.Number).
		Where("vaccine_id = ?", r.VaccineID).
		Where("vaccination_site_id = ?", siteID).
		Update()
	if err != nil {
		return EUnknown
	}

	return EOK
}
