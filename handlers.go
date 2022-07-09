package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func jsonResult(c *gin.Context, s SErr) {
	c.JSON(http.StatusOK, gin.H{
		"status": s,
	})
}

func jsonResultD(c *gin.Context, s SErr, d interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"status": s,
		"data":   d,
	})
}

func personExist(c *gin.Context) {
	idNumber := c.Param("idnumber")

	if idNumber == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	exist, r := PersonExist(idNumber)

	jsonResultD(c, r, exist)
}

func register(c *gin.Context) {
	var j RegisterQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	r := Register(&j)
	jsonResult(c, r)
}

func loginPerson(c *gin.Context) {
	var j LoginPersonQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, r := LoginPerson(&j)

	if r == EOK {
		if newJWT, err := CreateJWTPerson(p); err == nil {
			c.Header("X-Update-Authorization", newJWT)
		} else {
			log.Printf("[Warn] failed generating new jwt: %s\n", err)
			r = EUnknown
		}
	}

	jsonResultD(c, r, p)
}

func siteAdminExist(c *gin.Context) {
	account := c.Param("account")

	if account == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	exist, r := VaccinationSiteAdminExist(account)

	jsonResultD(c, r, exist)
}

func addSiteAdmin(c *gin.Context) {
	var j AddSiteAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	r := AddSiteAdmin(&j)
	jsonResult(c, r)
}

func loginSiteAdmin(c *gin.Context) {
	log.Println("login Site Admin")
	var j LoginSiteAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sa, r := LoginSiteAdmin(&j)

	if r == EOK {
		if newJWT, err := CreateJWTSiteAdmin(sa); err == nil {
			c.Header("X-Update-Authorization", newJWT)
		} else {
			log.Printf("[Warn] failed generating new jwt: %s\n", err)
			r = EUnknown
		}
	}

	jsonResultD(c, r, sa)
}

func loginAdmin(c *gin.Context) {
	var j LoginAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	r := LoginAdmin(&j)

	if r == EOK {
		if newJWT, err := CreateJWTAdmin(); err == nil {
			c.Header("X-Update-Authorization", newJWT)
		} else {
			log.Printf("[Warn] failed generating new jwt: %s\n", err)
			r = EUnknown
		}
	}

	jsonResult(c, r)
}

func changePasswordPerson(c *gin.Context) {
	var j ChangePasswordQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	u, _ := c.Get("user")
	up := u.(*Person)

	serr := ChangePasswordPerson(&j, up)
	jsonResult(c, serr)
}

func changeProfile(c *gin.Context) {
	var j ChangeProfileQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	u, _ := c.Get("user")
	up := u.(*Person)

	serr := ChangeProfile(&j, up)
	jsonResult(c, serr)
}

func getVaccinationLogPerson(c *gin.Context) {
	u, _ := c.Get("user")
	up := u.(*Person)

	p, serr := GetVaccinationLogPerson(up)
	jsonResultD(c, serr, p)
}

func makeAppointment(c  *gin.Context) {
	var j MakeAppointmentQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	u, _ := c.Get("user")
	up := u.(*Person)

	serr := MakeAppointment(&j, up.IDNumber)
	jsonResult(c, serr)
}

func removeAppointment(c *gin.Context) {
	ids := c.Param("id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemoveAppointment(id)
	jsonResult(c, serr)
}

func listAppointmentsPerson(c *gin.Context) {
	u, _ := c.Get("user")
	up := u.(*Person)

	p, serr := ListAppointmentsPerson(up.IDNumber)
	jsonResultD(c, serr, p)
}

func listSites(c *gin.Context) {
	var j ListSitesQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListSites(&j)
	jsonResultD(c, serr, p)
}

func listAllSites(c *gin.Context) {
	p, serr := ListAllSites()

	jsonResultD(c, serr, p)
}

func listInventoriesSite(c *gin.Context) {
	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	p, serr := ListInventoriesSite(sa.VaccinationSiteID)
	jsonResultD(c, serr, p)
}

func addInventories(c *gin.Context) {
	var j AddInventoriesQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := AddInventories(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func removeInventories(c *gin.Context) {
	ids := c.Param("vaccine_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := RemoveInventories(id, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func setInventories(c *gin.Context) {
	var j SetInventoriesQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := SetInventories(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func addVaccinationLogSite(c *gin.Context) {
	var j AddVaccinationLogSiteQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := AddVaccinationLogSite(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func listAppointmentsSite(c *gin.Context) {
	dates := c.Param("date")

	if dates == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	date, err := strconv.ParseInt(dates, 10, 64)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	p, serr := ListAppointmentsSite(sa, date)
	jsonResultD(c, serr, p)
}

func removeAppointmentSite(c *gin.Context) {
	ids := c.Param("appointment_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := RemoveAppointmentSite(sa.VaccinationSiteID, id)
	jsonResult(c, serr)
}

func addVaccine(c *gin.Context) {
	var j AddVaccineQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := AddVaccine(&j)
	jsonResult(c, serr)
}

func setVaccine(c *gin.Context) {
	var j SetVaccineQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := SetVaccine(&j)
	jsonResult(c, serr)
}

func removeVaccine(c *gin.Context) {
	ids := c.Param("vaccine_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemoveVaccine(id)
	jsonResult(c, serr)
}

func listVaccines(c *gin.Context) {
	p, serr := ListVaccines()
	jsonResultD(c, serr, p)
}

func addSite(c *gin.Context) {
	var j AddSiteQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := AddSite(&j)
	jsonResult(c, serr)
}

func getSite(c *gin.Context) {
	ids := c.Param("site_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	r, serr := GetSite(id)

	jsonResultD(c, serr, r)
}

func setSite(c *gin.Context) {
	var j SetSiteQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := SetSite(&j)
	jsonResult(c, serr)
}

func removeSite(c *gin.Context) {
	ids := c.Param("site_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemoveSite(id)
	jsonResult(c, serr)
}

func removeSiteAdmin(c *gin.Context) {
	var j RemoveSiteAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemoveSiteAdmin(&j)
	jsonResult(c, serr)
}

func listSiteAdmins(c *gin.Context) {
	ids := c.Param("site_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListSiteAdmins(id)
	jsonResultD(c, serr, p)
}

func setSiteAdminPassword(c *gin.Context) {
	var j SetSiteAdminPasswordQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := SetSiteAdminPassword(&j)
	jsonResult(c, serr)
}

func removePerson(c *gin.Context) {
	ids := c.Param("idnumber")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemovePerson(ids)
	jsonResult(c, serr)
}

func getPerson(c *gin.Context) {
	ids := c.Param("idnumber")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := GetPerson(ids)
	jsonResultD(c, serr, p)
}

func setPersonPassword(c *gin.Context) {
	var j SetPersonPasswordQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := SetPersonPassword(&j)
	jsonResult(c, serr)
}

func addArrangement(c *gin.Context) {
	var j AddArrangementQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := AddArrangement(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func removeArrangement(c *gin.Context) {
	var j RemoveArrangementQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := RemoveArrangement(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func setArrangement(c *gin.Context) {
	var j SetArrangementQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	serr := SetArrangement(&j, sa.VaccinationSiteID)
	jsonResult(c, serr)
}

func getArrangementDates(c *gin.Context) {
	ids := c.Param("site_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := GetArrangementDates(id)
	jsonResultD(c, serr, p)
}

func listArrangements(c *gin.Context) {
	var j ListArrangementsQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListArrangements(&j)
	jsonResultD(c, serr, p)
}

func addVaccinationLogAdmin(c *gin.Context) {
	var j AddVaccinationLogAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := AddVaccinationLogAdmin(&j)
	jsonResult(c, serr)
}

func removeVaccinationLogAdmin(c *gin.Context) {
	ids := c.Param("vaccination_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := RemoveVaccinationLogAdmin(id)
	jsonResult(c, serr)
}

func setVaccinationLogAdmin(c *gin.Context) {
	var j SetVaccinationLogAdminQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := SetVaccinationLogAdmin(&j)
	jsonResult(c, serr)
}

func listVaccinationLogsAll(c *gin.Context) {
	p, serr := ListVaccinationLogsAll()
	jsonResultD(c, serr, p)
}

func listVaccinationLogsSite(c *gin.Context) {
	ids := c.Param("site_id")

	if ids == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	id, err := strconv.Atoi(ids)
	if err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListVaccinationLogsSite(id)
	jsonResultD(c, serr, p)
}

func listVaccinationLogsPersonAdmin(c *gin.Context) {
	idNumber := c.Param("idnumber")

	if idNumber == "" {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListVaccinationLogsPersonAdmin(idNumber)
	jsonResultD(c, serr, p)
}

func listVaccinationLogsLocation(c *gin.Context) {
	var j ListVaccinationLogsLocationQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	p, serr := ListVaccinationLogsLocation(&j)
	jsonResultD(c, serr, p)
}

func phoneNumberExist(c *gin.Context)  {
	phoneNumber := c.Param("phone_number")

	p, serr := PhoneNumberExist(phoneNumber)
	jsonResultD(c, serr, p)
}

func getUser(c *gin.Context) {
	u, _ := c.Get("user")
	up := u.(*Person)

	jsonResultD(c, EOK, up)
}

func getSiteAdmin(c *gin.Context) {
	u, _ := c.Get("user")
	us := u.(*VaccinationSiteAdmin)

	jsonResultD(c, EOK, us)
}

func getAdmin(c *gin.Context) {
	jsonResultD(c, EOK, "admin")
}

func addVaccinationLogSiteByAppointment(c *gin.Context) {
	var j AddVaccinationLogSiteByAppointmentQ

	if err := c.ShouldBindJSON(&j); err != nil {
		jsonResult(c, EBadRequest)
		c.Abort()
		return
	}

	serr := AddVaccinationLogSiteByAppointment(&j)

	jsonResult(c, serr)
}

func getVaccinationVaccineCountAdmin(c *gin.Context) {
	p, serr := GetVaccinationVaccineCountAdmin()

	jsonResultD(c, serr, p)
}

func getVaccinationVaccineCountSite(c *gin.Context) {
	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	p, serr := GetVaccinationVaccineCountSite(sa.VaccinationSiteID)

	jsonResultD(c, serr, p)
}

func getVaccinationMonthCountAdmin(c *gin.Context) {
	p, serr := GetVaccinationMonthCountAdmin()

	jsonResultD(c, serr, p)
}

func getVaccinationMonthCountSite(c *gin.Context) {
	sai, _ := c.Get("user")
	sa := sai.(*VaccinationSiteAdmin)

	p, serr := GetVaccinationMonthCountSite(sa.VaccinationSiteID)

	jsonResultD(c, serr, p)
}