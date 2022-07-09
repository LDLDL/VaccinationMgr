package main

type AddVaccineQ struct {
	Type         string `json:"type"         binding:"required"`
	Manufacturer string `json:"manufacturer" binding:"required"`
	Location     string `json:"location"     binding:"required"`
}

func AddVaccine(r *AddVaccineQ) SErr {
	vaccine := &Vaccine{
		Type:         r.Type,
		Manufacturer: r.Manufacturer,
		Location:     r.Location,
	}

	_, err := db.Model(vaccine).Insert()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type SetVaccineQ struct {
	ID           int    `json:"id"           binding:"required"`
	Type         string `json:"type"         binding:"required"`
	Manufacturer string `json:"manufacturer" binding:"required"`
	Location     string `json:"location"     binding:"required"`
}

func SetVaccine(r *SetVaccineQ) SErr {
	vaccine := &Vaccine{
		ID:           r.ID,
		Manufacturer: r.Manufacturer,
		Type:         r.Type,
		Location:     r.Location,
	}

	_, err := db.Model(vaccine).WherePK().Update()
	if err != nil {
		return EUnknown
	}

	return EOK
}

func RemoveVaccine(vid int) SErr {
	_, err := db.Model((*Vaccine)(nil)).Where("id = ?", vid).Delete()
	if err != nil {
		return EUnknown
	}

	return EOK
}

type ListVaccinesP struct {
	Vaccines []Vaccine `json:"vaccines"`
}

func ListVaccines() (*ListVaccinesP, SErr) {
	var vaccines []Vaccine
	err := db.Model(&vaccines).Select()
	if err != nil {
		return nil, EUnknown
	}
	return &ListVaccinesP{Vaccines: vaccines}, EOK
}
