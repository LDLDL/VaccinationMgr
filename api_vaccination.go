package main

import (
	"github.com/go-pg/pg/v10"
	"time"
)

type VaccinationLogsP struct {
	Vaccinations []VaccinationLog `json:"vaccinations"`
}

func GetVaccinationLogPerson(p *Person) (*VaccinationLogsP, SErr) {
	var vaccinations []VaccinationLog

	err := db.Model(&vaccinations).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Where("person_id_number = ?", p.IDNumber).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &VaccinationLogsP{Vaccinations: vaccinations}, EOK
}

type AddVaccinationLogSiteQ struct {
	VaccineID        int    `json:"vaccine_id"        binding:"required"`
	PersonIDNumber   string `json:"person_id_number"  binding:"required"`
	VaccinationTimes int    `json:"vaccination_times" binding:"required"`
}

func AddVaccinationLogSite(r *AddVaccinationLogSiteQ, siteID int) SErr {
	tx, err := db.Begin()
	defer tx.Close()

	if err != nil {
		return EUnknown
	}

	vi := &VaccineInventory{}
	err = tx.Model(vi).
		Where("vaccine_id = ?", r.VaccineID).
		Where("vaccination_site_id = ?", siteID).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	vi.Number -= 1
	_, err = tx.Model(vi).
		Where("vaccine_id = ?", r.VaccineID).
		Where("vaccination_site_id = ?", siteID).
		Update()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	vl := &VaccinationLog{
		VaccinationSiteID: siteID,
		VaccineID:         r.VaccineID,
		PersonIDNumber:    r.PersonIDNumber,
		Time:              time.Now().Unix(),
		VaccinationTimes:  r.VaccinationTimes,
	}
	_, err = tx.Model(vl).Insert()
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

type AddVaccinationLogSiteByAppointmentQ struct {
	AppointmentID    int `json:"appointment_id"    binding:"required"`
	VaccinationTimes int `json:"vaccination_times" binding:"required"`
}

func AddVaccinationLogSiteByAppointment(r *AddVaccinationLogSiteByAppointmentQ) SErr {
	tx, err := db.Begin()
	defer tx.Close()

	if err != nil {
		return EUnknown
	}

	appointment := &VaccinationAppointment{}
	err = tx.Model(appointment).Where("id = ?", r.AppointmentID).Select()
	if err != nil {
		_ = tx.Rollback()
		return EAppointmentNotExist
	}

	if appointment.Vaccination {
		return EUnknown
	}

	vi := &VaccineInventory{}
	err = tx.Model(vi).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Select()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	vi.Number -= 1
	_, err = tx.Model(vi).
		Where("vaccine_id = ?", appointment.VaccineID).
		Where("vaccination_site_id = ?", appointment.VaccinationSiteID).
		Update()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	vl := &VaccinationLog{
		VaccinationSiteID: appointment.VaccinationSiteID,
		VaccineID:         appointment.VaccineID,
		PersonIDNumber:    appointment.PersonIDNumber,
		Time:              time.Now().Unix(),
		VaccinationTimes:  r.VaccinationTimes,
	}

	_, err = tx.Model(vl).Insert()
	if err != nil {
		_ = tx.Rollback()
		return EUnknown
	}

	appointment.Vaccination = true
	_, err = tx.Model(appointment).Where("id = ?", r.AppointmentID).Update()
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

type AddVaccinationLogAdminQ struct {
	VaccineID         int    `json:"vaccine_id"          binding:"required"`
	VaccinationSiteID int    `json:"vaccination_site_id" binding:"required"`
	PersonIDNumber    string `json:"person_id_number"    binding:"required"`
	Time              int64  `json:"time"                binding:"required"`
	VaccinationTimes  int    `json:"vaccination_times"   binding:"required"`
}

func AddVaccinationLogAdmin(r *AddVaccinationLogAdminQ) SErr {
	vl := &VaccinationLog{
		VaccineID:         r.VaccineID,
		VaccinationSiteID: r.VaccinationSiteID,
		PersonIDNumber:    r.PersonIDNumber,
		Time:              r.Time,
		VaccinationTimes:  r.VaccinationTimes,
	}

	_, err := db.Model(vl).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

func RemoveVaccinationLogAdmin(vid int) SErr {
	_, err := db.Model((*VaccinationLog)(nil)).Where("id = ?", vid).Delete()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type SetVaccinationLogAdminQ struct {
	ID                int    `json:"id"                  binding:"required"`
	VaccineID         int    `json:"vaccine_id"          binding:"required"`
	VaccinationSiteID int    `json:"vaccination_site_id" binding:"required"`
	PersonIDNumber    string `json:"person_id_number"    binding:"required"`
	Time              int64  `json:"time"                binding:"required"`
	VaccinationTimes  int    `json:"vaccination_times"   binding:"required"`
}

func SetVaccinationLogAdmin(r *SetVaccinationLogAdminQ) SErr {
	vl := &VaccinationLog{
		ID:                r.ID,
		VaccineID:         r.VaccineID,
		VaccinationSiteID: r.VaccinationSiteID,
		PersonIDNumber:    r.PersonIDNumber,
		Time:              r.Time,
		VaccinationTimes:  r.VaccinationTimes,
	}

	_, err := db.Model(vl).WherePK().Update()
	if err != nil {
		return EUnknown
	}

	return EOK
}

func ListVaccinationLogsAll() (*VaccinationLogsP, SErr) {
	var logs []VaccinationLog
	err := db.Model(&logs).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &VaccinationLogsP{Vaccinations: logs}, EOK
}

func ListVaccinationLogsSite(sid int) (*VaccinationLogsP, SErr) {
	var logs []VaccinationLog

	err := db.Model(&logs).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Where("vaccination_site_id = ?", sid).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &VaccinationLogsP{Vaccinations: logs}, EOK
}

func ListVaccinationLogsPersonAdmin(idNumber string) (*VaccinationLogsP, SErr) {
	var logs []VaccinationLog

	err := db.Model(&logs).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Where("person_id_number = ?", idNumber).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &VaccinationLogsP{Vaccinations: logs}, EOK
}

type ListVaccinationLogsLocationQ struct {
	Province string `json:"province" binding:"required"`
	City     string `json:"city"`
	District string `json:"district"`
}

func ListVaccinationLogsLocation(r *ListVaccinationLogsLocationQ) (*VaccinationLogsP, SErr) {
	var logs []VaccinationLog
	var sites []VaccinationSite
	var sitesID []int
	if r.City == "" {
		err := db.Model(&sites).
			Where("province = ?", r.Province).
			Select()
		if err != nil {
			return nil, EUnknown
		}
	} else if r.District == "" {
		err := db.Model(&sites).
			Where("province = ?", r.Province).
			Where("city = ?", r.City).
			Select()
		if err != nil {
			return nil, EUnknown
		}
	} else {
		err := db.Model(&sites).
			Where("province = ?", r.Province).
			Where("city = ?", r.City).
			Where("district = ?", r.District).
			Select()
		if err != nil {
			return nil, EUnknown
		}
	}

	for _, site := range sites {
		sitesID = append(sitesID, site.ID)
	}
	err := db.Model(&logs).
		Relation("Person").
		Relation("VaccinationSite").
		Relation("Vaccine").
		Where("vaccination_site_id in (?)", pg.In(sitesID)).
		Select()
	if err != nil {
		return nil, EUnknown
	}

	return &VaccinationLogsP{Vaccinations: logs}, EOK
}

type VaccinationVaccineCountP struct {
	Count     int     `json:"count"`
	VaccineID int     `json:"vaccine_id"`
	Vaccine   Vaccine `json:"vaccine"`
}

func GetVaccinationVaccineCountAdmin() ([]VaccinationVaccineCountP, SErr) {
	var vaccines []Vaccine
	var vaccineCount []VaccinationVaccineCountP

	err := db.Model(&vaccines).Select()
	if err != nil {
		return nil, EUnknown
	}

	for _, vaccine := range vaccines {
		count, err := db.Model((*VaccinationLog)(nil)).
			Where("vaccine_id = ?", vaccine.ID).
			Count()
		if err != nil {
			count = 0
		}

		vaccineCount = append(vaccineCount, VaccinationVaccineCountP{
			Count:     count,
			Vaccine:   vaccine,
			VaccineID: vaccine.ID,
		})
	}

	return vaccineCount, EOK
}

func GetVaccinationVaccineCountSite(sid int) ([]VaccinationVaccineCountP, SErr) {
	var vaccines []Vaccine
	var vaccineCount []VaccinationVaccineCountP

	// 查询所有疫苗
	err := db.Model(&vaccines).Select()
	if err != nil {
		return nil, EUnknown
	}

	for _, vaccine := range vaccines {
		// 分别查询每种疫苗的接种数量
		count, err := db.Model((*VaccinationLog)(nil)).
			Where("vaccine_id = ?", vaccine.ID).
			Where("vaccination_site_id = ?", sid).
			Count()
		if err != nil {
			count = 0
		}

		// 计算比例，添加到结果中
		vaccineCount = append(vaccineCount, VaccinationVaccineCountP{
			Count:     count,
			Vaccine:   vaccine,
			VaccineID: vaccine.ID,
		})
	}

	return vaccineCount, EOK
}

type VaccinationMonthCountP struct {
	Count int `json:"count"`
	Month int `json:"month"`
}

func GetVaccinationMonthCountAdmin() ([]VaccinationMonthCountP, SErr) {
	var monthCount []VaccinationMonthCountP

	thisYear := time.Now().Year()
	for i := 1; i < 13; i++ {
		firstDay := time.Date(thisYear, time.Month(i), 1, 0, 0, 0, 0, time.Local)
		lastDay := firstDay.AddDate(0, 1, -1)
		lastDay = lastDay.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

		count, err := db.Model((*VaccinationLog)(nil)).
			Where("time >= ?", firstDay.Unix()).
			Where("time <= ?", lastDay.Unix()).
			Count()

		if err != nil {
			count = 0
		}

		monthCount = append(monthCount, VaccinationMonthCountP{
			Month: i,
			Count: count,
		})
	}

	return monthCount, EOK
}

func GetVaccinationMonthCountSite(sid int) ([]VaccinationMonthCountP, SErr) {
	var monthCount []VaccinationMonthCountP

	thisYear := time.Now().Year()
	for i := 1; i < 13; i++ {
		firstDay := time.Date(thisYear, time.Month(i), 1, 0, 0, 0, 0, time.Local)
		lastDay := firstDay.AddDate(0, 1, -1)
		lastDay = lastDay.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

		count, err := db.Model((*VaccinationLog)(nil)).
			Where("time >= ?", firstDay.Unix()).
			Where("time <= ?", lastDay.Unix()).
			Where("vaccination_site_id = ?", sid).
			Count()

		if err != nil {
			count = 0
		}

		monthCount = append(monthCount, VaccinationMonthCountP{
			Month: i,
			Count: count,
		})
	}

	return monthCount, EOK
}
