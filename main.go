package main

import (
	"github.com/BurntSushi/toml"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"io/ioutil"
	"log"
	"net/http"
)

var db *pg.DB
var config Config

func init() {
	// read config file
	config.SetDefault()
	if c, err := ioutil.ReadFile("./config.toml"); err == nil {
		if err := toml.Unmarshal(c, &config); err != nil {
			log.Printf("Failed loading config: %s, use default settings.\n", err)
			config.SetDefault()
		} else {
			log.Println("[Info] Config loaded.")
		}
	} else {
		log.Println("[Info] No config file found. Use default config.")
	}

	// hash admin password
	config.Security.AdminPassHash = PasswordHash(config.Security.AdminPassword)
	// clear admin password
	config.Security.AdminPassword = ""

	// init db
	db = pg.Connect(&pg.Options{
		Addr:     config.DB.Addr,
		User:     config.DB.User,
		Password: config.DB.Password,
		Database: config.DB.Database,
	})

}

func registerRouter(r *gin.Engine) {
	a := r.Group("/api", JWTRetrieve())
	{
		user := a.Group("/user")
		{
			user.GET("/me", getUser)
			user.GET("/exist/:idnumber", personExist)
			user.POST("/register", register)
			user.POST("/login", loginPerson)
			uAuthed := user.Group("/", personAuth())
			{
				uAuthed.POST("/password", changePasswordPerson)
				uAuthed.POST("/profile", changeProfile)
				uAuthed.GET("/vaccinations/list", getVaccinationLogPerson)
				appointment := uAuthed.Group("/appointments")
				{
					appointment.POST("/make", makeAppointment)
					appointment.GET("/remove/:id", removeAppointment)
					appointment.GET("/list", listAppointmentsPerson)
				}
			}
		}
		site := a.Group("/sites")
		{
			site.POST("/login", loginSiteAdmin)
			site.POST("/list", listSites)
			site.GET("/list/all", listAllSites)
			site.POST("/arrangements/list", listArrangements)
			site.GET("/arrangements/dates/:site_id", getArrangementDates)
			sAuthed := site.Group("/", siteAdminAuth())
			{
				sAuthed.GET("/admin", getSiteAdmin)
				sAuthed.POST("/vaccinations/add", addVaccinationLogSite)
				sAuthed.POST("/vaccinations/add/appointment", addVaccinationLogSiteByAppointment)
				sAuthed.GET("/vaccinations/count/vaccine", getVaccinationVaccineCountSite)
				sAuthed.GET("/vaccinations/count/month", getVaccinationMonthCountSite)
				inventory := sAuthed.Group("/inventories")
				{
					inventory.GET("/list/all", listInventoriesSite)
					inventory.POST("/add", addInventories)
					inventory.GET("/remove/:vaccine_id", removeInventories)
					inventory.POST("/set", setInventories)
				}
				appointmentSite := sAuthed.Group("/appointments")
				{
					appointmentSite.GET("/list/:date", listAppointmentsSite)
					appointmentSite.GET("/remove/:appointment_id", removeAppointmentSite)
					appointmentSite.POST("/arrangements/add", addArrangement)
					appointmentSite.POST("/arrangements/remove", removeArrangement)
					appointmentSite.POST("/arrangements/set", setArrangement)
				}
			}
		}
		admin := a.Group("/admin")
		{
			admin.POST("/login", loginAdmin)
			aAuthed := admin.Group("/", adminAuth())
			{
				aAuthed.GET("/", getAdmin)
				vaccineManage := aAuthed.Group("/vaccines")
				{
					vaccineManage.POST("/add", addVaccine)
					vaccineManage.POST("/set", setVaccine)
					vaccineManage.GET("/remove/:vaccine_id", removeVaccine)
					//vaccineManage.POST("/list", listVaccines)
				}
				siteManage := aAuthed.Group("/sites")
				{
					siteManage.POST("/add", addSite)
					siteManage.POST("/set", setSite)
					siteManage.GET("/remove/:site_id", removeSite)
					siteManage.GET("/:site_id", getSite)
				}
				siteAdminManage := aAuthed.Group("/siteadmins")
				{
					siteAdminManage.GET("/exist/:account", siteAdminExist)
					siteAdminManage.POST("/add", addSiteAdmin)
					siteAdminManage.POST("/remove", removeSiteAdmin)
					siteAdminManage.GET("/list/:site_id", listSiteAdmins)
					siteAdminManage.POST("/password", setSiteAdminPassword)
				}
				personManage := aAuthed.Group("/user")
				{
					personManage.GET("/remove/:idnumber", removePerson)
					personManage.GET("/:idnumber", getPerson)
					//personManage.POST("/list")
					personManage.POST("/password", setPersonPassword)
				}
				vaccinationManage := aAuthed.Group("/vaccinations")
				{
					vaccinationManage.GET("/list/all", listVaccinationLogsAll)
					vaccinationManage.GET("/list/site/:site_id", listVaccinationLogsSite)
					vaccinationManage.GET("/list/user/:idnumber", listVaccinationLogsPersonAdmin)
					vaccinationManage.POST("/list/location", listVaccinationLogsLocation)
					vaccinationManage.POST("/add", addVaccinationLogAdmin)
					vaccinationManage.GET("/remove/:vaccination_id", removeVaccinationLogAdmin)
					vaccinationManage.POST("/set", setVaccinationLogAdmin)
					vaccinationManage.GET("/count/vaccine", getVaccinationVaccineCountAdmin)
					vaccinationManage.GET("/count/month", getVaccinationMonthCountAdmin)
				}
			}
		}
		a.GET("/vaccines/list", listVaccines)
		a.GET("/phone/exist/:phone_number", phoneNumberExist)
	}

	r.HandleMethodNotAllowed = true
	r.NoRoute(ServeStatic(""))
}

func ServeStatic(prefix string) gin.HandlerFunc {
	fs := FileServer(gin.Dir(config.Site.Static, false))
	if prefix != "" {
		fs = http.StripPrefix(prefix, fs)
	}
	return func(c *gin.Context) {
		fs.ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	router := gin.Default()

	registerRouter(router)

	if config.Https.Cert != "" && config.Https.Key != "" {
		_ = router.RunTLS(config.Site.Listen, config.Https.Cert, config.Https.Key)
	} else {
		_ = router.Run(config.Site.Listen)
	}
}
