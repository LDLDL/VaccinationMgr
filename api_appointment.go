package main

import (
	"fmt"
	"github.com/go-pg/pg/v10"
	"time"
)

type MakeAppointmentQ struct {
	VaccineID         int   `json:"vaccine_id"          binding:"required"`
	VaccinationSiteID int   `json:"vaccination_site_id" binding:"required"`
	Date              int64 `json:"date"                binding:"required"`
}

func MakeAppointment(r *MakeAppointmentQ, idNumber string) SErr {
	if r.Date < time.Now().Unix() {
		return EPassedDate
	}

	var appointments []VaccinationAppointment

	tx, err := db.Begin()
	defer tx.Close()
	if err != nil {
		return EUnknown
	}

	err = tx.Model(&appointments).
		Where("person_id_number = ?", idNumber).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	now := time.Now()
	for _, appo := range appointments {
		if now.Before(time.Unix(appo.Date, 0)) && !appo.Vaccination {
			return EAppointmentExist
		}
	}

	arrangement := &AppointmentArrangement{}
	err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", r.VaccinationSiteID).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EArrangementNotExist
	}

	arrangement.BookedNumber += 1
	arrangement.BookID += 1

	_, err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", r.VaccinationSiteID).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Update()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	arrangements := make([]AppointmentArrangement, 0)
	err = tx.Model(&arrangements).
		Where("vaccination_site_id = ?", r.VaccinationSiteID).
		Where("date = ?", r.Date).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	t := time.Unix(r.Date, 0)
	appointmentID := t.Year()*1000000000 + int(t.Month())*10000000 + t.Day()*100000

	for _, arr := range arrangements {
		appointmentID += arr.BookID
	}

	appointment := &VaccinationAppointment{
		PersonIDNumber:    idNumber,
		VaccineID:         r.VaccineID,
		VaccinationSiteID: r.VaccinationSiteID,
		Date:              r.Date,
		Vaccination:       false,
		AppointmentID:     appointmentID,
	}
	_, err = tx.Model(appointment).Insert()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	return EOK
}

func RemoveAppointment(id int) SErr {
	tx, err := db.Begin()
	defer tx.Close()
	if err != nil {
		return EUnknown
	}

	appointment := &VaccinationAppointment{}
	err = tx.Model(appointment).Where("id = ?", id).Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	arrangement := &AppointmentArrangement{}
	err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("date = ?", appointment.Date).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	arrangement.BookedNumber -= 1

	_, err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("date = ?", appointment.Date).
		Update()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	_, err = tx.Model(appointment).WherePK().Delete()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	return EOK
}

type ListAppointmentsPersonP struct {
	Available *VaccinationAppointment  `json:"available"`
	History   []VaccinationAppointment `json:"history"`
}

func ListAppointmentsPerson(idNumber string) (*ListAppointmentsPersonP, SErr) {
	appointments := new([]VaccinationAppointment)

	err := db.Model(appointments).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Where("person_id_number = ?", idNumber).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	result := &ListAppointmentsPersonP{}
	result.Available = nil
	now := time.Now()
	for _, appointment := range *appointments {
		if now.Before(time.Unix(appointment.Date, 0)) && !appointment.Vaccination {
			result.Available = &appointment
		} else {
			result.History = append(result.History, appointment)
		}
	}

	return result, EOK
}

type ListAppointmentsSiteP struct {
	Appointments              []VaccinationAppointment `json:"appointments"`
	AppointmentsNoVaccination []VaccinationAppointment `json:"appointments_no_vaccination"`
}

func ListAppointmentsSite(sa *VaccinationSiteAdmin, date int64) (*ListAppointmentsSiteP, SErr) {
	var appointments []VaccinationAppointment
	var appointmentsNoVaccination []VaccinationAppointment

	err := db.Model(&appointments).
		Relation("Person").
		Relation("Vaccine").
		Where("vaccination_site_id = ?", sa.VaccinationSiteID).
		Where("date = ?", date).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	err = db.Model(&appointmentsNoVaccination).
		Relation("Person").
		Relation("Vaccine").
		Where("vaccination_site_id = ?", sa.VaccinationSiteID).
		Where("date = ?", date).
		Where("vaccination = false").
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &ListAppointmentsSiteP{Appointments: appointments, AppointmentsNoVaccination: appointmentsNoVaccination}, EOK
}

func RemoveAppointmentSite(siteID int, aID int) SErr {
	tx, err := db.Begin()
	defer tx.Close()
	if err != nil {
		return EUnknown
	}

	appointment := &VaccinationAppointment{}
	err = tx.Model(appointment).
		Where("id = ?", aID).
		Where("vaccination_site_id = ?", siteID).
		Select()
	if err == pg.ErrNoRows {
		_ = tx.Rollback()
		return EAppointmentNotExist
	} else if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	arrangement := &AppointmentArrangement{}
	err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("date = ?", appointment.Date).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	arrangement.BookedNumber -= 1

	_, err = tx.Model(arrangement).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("date = ?", appointment.Date).
		Update()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	_, err = tx.Model((*VaccinationAppointment)(nil)).
		Where("id = ?", aID).
		Where("vaccination_site_id = ?", siteID).
		Delete()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type AddArrangementQ struct {
	Date        int64 `json:"date"         binding:"required"`
	VaccineID   int   `json:"vaccine_id"   binding:"required"`
	TotalNumber int   `json:"total_number" binding:"required"`
}

func AddArrangement(r *AddArrangementQ, sid int) SErr {
	err := db.Model(&AppointmentArrangement{}).
		Where("vaccination_site_id = ?", sid).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Select()
	if err == nil {
		return EArrangementExist
	} else if err != pg.ErrNoRows {
		fmt.Printf("err1: %s\n", err)
		return EUnknown
	}
	aa := &AppointmentArrangement{
		VaccineID:         r.VaccineID,
		VaccinationSiteID: sid,
		Date:              r.Date,
		TotalNumber:       r.TotalNumber,
		BookedNumber:      0,
	}

	_, err = db.Model(aa).Insert()
	if err != nil {
		fmt.Printf("err: %s\n", err)
		return EUnknown
	}

	return EOK
}

type RemoveArrangementQ struct {
	Date      int64 `json:"date"       binding:"required"`
	VaccineID int   `json:"vaccine_id" binding:"required"`
}

func RemoveArrangement(r *RemoveArrangementQ, sid int) SErr {
	aa := &AppointmentArrangement{}

	_, err := db.Model(aa).
		Where("vaccination_site_id = ?", sid).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Delete()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type SetArrangementQ struct {
	Date        int64 `json:"date"          binding:"required"`
	VaccineID   int   `json:"vaccine_id"    binding:"required"`
	TotalNumber int   `json:"total_number"  binding:"required"`
}

func SetArrangement(r *SetArrangementQ, sid int) SErr {
	aa := &AppointmentArrangement{}

	err := db.Model(aa).
		Where("vaccination_site_id = ?", sid).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Select()
	if err != nil {
		return EArrangementNotExist
	}

	aa.TotalNumber = r.TotalNumber

	_, err = db.Model(aa).
		Where("vaccination_site_id = ?", sid).
		Where("vaccine_id = ?", r.VaccineID).
		Where("date = ?", r.Date).
		Update()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type GetArrangementDatesP struct {
	Dates []int64 `json:"dates"`
}

func GetArrangementDates(sid int) (*GetArrangementDatesP, SErr) {
	var arrs []AppointmentArrangement
	p := &GetArrangementDatesP{}
	now := time.Now().Unix()

	err := db.Model(&arrs).
		Where("vaccination_site_id = ?", sid).
		Where("date >= ?", now).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	var flag bool
	for _, arrangement := range arrs {
		flag = true
		for _, d := range p.Dates {
			if arrangement.Date == d {
				flag = false
				break
			}
		}
		if flag {
			p.Dates = append(p.Dates, arrangement.Date)
		}
	}

	return p, EOK
}

type ListArrangementsQ struct {
	VaccinationSiteID int   `json:"vaccination_site_id" binding:"required"`
	Date              int64 `json:"date"                binding:"required"`
}

type ListArrangementsP struct {
	Arrangements []AppointmentArrangement `json:"arrangements"`
}

func ListArrangements(r *ListArrangementsQ) (*ListArrangementsP, SErr) {
	var arrs []AppointmentArrangement

	err := db.Model(&arrs).
		Relation("Vaccine").
		Where("vaccination_site_id = ?", r.VaccinationSiteID).
		Where("date = ?", r.Date).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &ListArrangementsP{Arrangements: arrs}, EOK
}
