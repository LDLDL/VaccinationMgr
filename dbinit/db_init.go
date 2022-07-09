package main

import (
	"fmt"
	"github.com/BurntSushi/toml"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"io/ioutil"
	"log"
	"math/rand"
	"strconv"
	"time"
)

var db *pg.DB
var config Config

func DBCreateTable() {
	models := []interface{}{
		(*Vaccine)(nil),
		(*Person)(nil),
		(*VaccinationSite)(nil),
		(*VaccineInventory)(nil),
		(*VaccinationSiteAdmin)(nil),
		(*VaccinationAppointment)(nil),
		(*AppointmentArrangement)(nil),
		(*VaccinationLog)(nil),
	}

	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{})
		if err != nil {
			fmt.Printf("err: %s\n", err)
		}
	}

	qs := []string{
		"ALTER TABLE vaccination_site_admins ADD CONSTRAINT vaccination_site_fk " +
			"FOREIGN KEY (vaccination_site_id) REFERENCES vaccination_sites(id) ON DELETE CASCADE",

		"ALTER TABLE vaccine_inventories ADD CONSTRAINT vaccine_fk " +
			"FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE;",
		"ALTER TABLE vaccine_inventories ADD CONSTRAINT vaccination_site_fk " +
			"FOREIGN KEY (vaccination_site_id) REFERENCES vaccination_sites(id) ON DELETE CASCADE",

		"ALTER TABLE vaccination_logs ADD CONSTRAINT vaccination_site_fk " +
			"FOREIGN KEY (vaccination_site_id) REFERENCES vaccination_sites(id) ON DELETE CASCADE",
		"ALTER TABLE vaccination_logs ADD CONSTRAINT person_fk " +
			"FOREIGN KEY (person_id_number) REFERENCES people(id_number) ON DELETE CASCADE",
		"ALTER TABLE vaccination_logs ADD CONSTRAINT vaccine_fk " +
			"FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE;",

		"ALTER TABLE vaccination_appointments ADD CONSTRAINT vaccination_site_fk " +
			"FOREIGN KEY (vaccination_site_id) REFERENCES vaccination_sites(id) ON DELETE CASCADE",
		"ALTER TABLE vaccination_appointments ADD CONSTRAINT person_fk " +
			"FOREIGN KEY (person_id_number) REFERENCES people(id_number) ON DELETE CASCADE",
		"ALTER TABLE vaccination_appointments ADD CONSTRAINT vaccine_fk " +
			"FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE;",

		"ALTER TABLE appointment_arrangements ADD CONSTRAINT vaccination_site_fk " +
			"FOREIGN KEY (vaccination_site_id) REFERENCES vaccination_sites(id) ON DELETE CASCADE",
		"ALTER TABLE appointment_arrangements ADD CONSTRAINT vaccine_fk " +
			"FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE;",
	}

	for _, q := range qs {
		_, err := db.Exec(q)
		if err != nil {
			fmt.Printf("err: %s\n", err)
		}
	}
}

func InsertSomeData() {
	vaccines := []interface{}{
		&Vaccine{
			Type:         "灭活疫苗 Vero细胞",
			Manufacturer: "科兴",
			Location:     "北京",
		},
		&Vaccine{
			Type:         "灭活疫苗 Vero细胞",
			Manufacturer: "北京生物",
			Location:     "北京",
		},
		&Vaccine{
			Type:         "灭活疫苗 Vero细胞",
			Manufacturer: "武汉生物",
			Location:     "武汉",
		},
		&Vaccine{
			Type:         "5型腺病毒载体",
			Manufacturer: "康希诺生物",
			Location:     "北京",
		},
		&Vaccine{
			Type:         "CHO细胞",
			Manufacturer: "智飞龙马生物",
			Location:     "安徽",
		},
		&Vaccine{
			Type:         "mRNA疫苗",
			Manufacturer: "辉瑞",
			Location:     "海外",
		},
	}

	for _, vaccine := range vaccines {
		_, err := db.Model(vaccine).Insert()
		if err != nil {
			fmt.Printf("err: %s\n", err)
		}
	}

	rand.Seed(233)

	bth := time.Date(2000, 1, 1, 0, 0, 0, 0, time.Local).Unix()
	phash := PasswordHash("123")
	sex := []string{"男", "女"}
	phone := 13550000000

	firstNames := []string{"赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳"}
	lastNames := []string{"嘉懿", "煜城", "懿轩", "烨伟", "苑博", "伟泽", "熠彤", "正豪", "弘文", "鸿煊", "博涛", "烨霖", "烨华", "煜祺", "智宸", "昊然", "明杰", "立诚", "立轩", "立辉", "峻熙", "熠彤", "鸿煊", "烨霖", "哲瀚", "鑫鹏", "致远", "俊驰", "黎昕", "浩宇", "雨泽", "烨磊", "晟睿", "天佑", "文昊", "修洁", "远航", "旭尧", "鸿涛", "伟祺", "荣轩", "越泽", "瑾瑜", "皓轩", "擎苍", "擎宇", "志泽", "睿渊", "楷瑞", "伟诚", "健柏", "子轩", "弘文", "哲瀚", "雨泽", "鑫磊", "修杰", "建辉", "晋鹏", "天磊", "绍辉", "泽洋", "明轩", "鹏煊", "昊强", "伟宸", "博超", "君浩", "子骞", "明辉", "明诚", "翰飞", "鹏涛", "炎彬", "鹤轩", "越彬", "风华", "靖琪", "高格", "光华", "国源", "冠宇", "晗昱", "涵润", "翰海", "昊乾", "浩博", "和安", "弘博", "宏恺", "鸿朗", "金鑫", "锦程", "华奥", "华灿", "嘉慕", "坚秉", "建明", "俊明", "瑾瑜", "晋鹏", "经赋", "景同", "靖琪", "君昊", "季同", "开济", "凯安", "康成", "乐语", "力勤", "良哲", "祺祥", "荣轩", "理群", "茂彦", "敏博", "明达", "朋义", "彭泽", "鹏举", "浦泽", "奇邃", "濮存", "溥心", "璞瑜", "锐达", "睿慈", "绍祺", "圣杰", "晟睿", "思源", "斯年", "文虹", "向笛", "泰宁", "天佑", "同巍", "奕伟", "祺温", "越彬", "蕴和", "旭尧", "英韶", "心远", "欣德", "新翰", "兴言", "星阑", "修为", "炫明", "学真", "雪风", "雅昶", "阳曦", "烨熠", "永贞", "咏德", "宇寰", "雨泽", "玉韵", "君平", "哲彦", "振海", "正志", "子晋", "自怡", "德赫"}

	for i := 350104200000000000; i < 350104200000030000; i++ {
		p := &Person{
			IDNumber:    strconv.Itoa(i),
			PassHash:    phash,
			Name:        firstNames[rand.Intn(len(firstNames))] + lastNames[rand.Intn(len(lastNames))],
			Birthday:    bth,
			Sex:         sex[rand.Intn(2)],
			PhoneNumber: strconv.Itoa(phone),
		}
		phone++

		_, _ = db.Model(p).Insert()
	}

	sites := []interface{}{
		&VaccinationSite{
			Name:     "仓前接种点",
			Address:  "仓前街道1号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "上渡接种点",
			Address:  "上渡街道1号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "奥体接种点",
			Address:  "奥体中心",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "金山接种点",
			Address:  "浦上大道200号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "桔园洲接种点",
			Address:  "滨洲路66号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "城门接种点",
			Address:  "福峡路1号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "白湖亭接种点",
			Address:  "则徐大道1号",
			Province: "福建省",
			City:     "福州市",
			District: "仓山区",
		},
		&VaccinationSite{
			Name:     "达道接种点",
			Address:  "达道路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "台江步行街接种点",
			Address:  "台江路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "上杭接种点",
			Address:  "上杭路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "下杭接种点",
			Address:  "下杭路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "鳌峰接种点",
			Address:  "鳌峰路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "南公园接种点",
			Address:  "国货西路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "大利嘉接种点",
			Address:  "五一中路160号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "茶亭接种点",
			Address:  "八一七中路1号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "宝龙接种点",
			Address:  "工业路路190号",
			Province: "福建省",
			City:     "福州市",
			District: "台江区",
		},
		&VaccinationSite{
			Name:     "南门兜接种点",
			Address:  "新权路30号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "乌山接种点",
			Address:  "乌山路100号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "东街口接种点",
			Address:  "八一七北路70号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "屏山接种点",
			Address:  "鼓屏路60号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "西湖接种点",
			Address:  "湖滨路60号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "华林路接种点",
			Address:  "华林路70号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "温泉公园接种点",
			Address:  "温泉公园路10号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "省立医院接种点",
			Address:  "东街134号",
			Province: "福建省",
			City:     "福州市",
			District: "鼓楼区",
		},
		&VaccinationSite{
			Name:     "五里亭接种点",
			Address:  "福马路400号",
			Province: "福建省",
			City:     "福州市",
			District: "晋安区",
		},
		&VaccinationSite{
			Name:     "紫阳接种点",
			Address:  "福马路100号",
			Province: "福建省",
			City:     "福州市",
			District: "晋安区",
		},
		&VaccinationSite{
			Name:     "前屿接种点",
			Address:  "福马路500号",
			Province: "福建省",
			City:     "福州市",
			District: "晋安区",
		},
		&VaccinationSite{
			Name:     "鼓山接种点",
			Address:  "福马路990号",
			Province: "福建省",
			City:     "福州市",
			District: "晋安区",
		},
		&VaccinationSite{
			Name:     "泰禾接种点",
			Address:  "泰禾广场",
			Province: "福建省",
			City:     "福州市",
			District: "晋安区",
		},
		&VaccinationSite{
			Name:     "漳州市医院接种点",
			Address:  "漳州市医院",
			Province: "福建省",
			City:     "漳州市",
			District: "芗城区",
		},
		&VaccinationSite{
			Name:     "龙文区接种点",
			Address:  "龙文区",
			Province: "福建省",
			City:     "漳州市",
			District: "龙文区",
		},
		&VaccinationSite{
			Name:     "厦门大学接种点",
			Address:  "厦门大学",
			Province: "福建省",
			City:     "厦门市",
			District: "湖里区",
		},
		&VaccinationSite{
			Name:     "思明区接种点",
			Address:  "思明区",
			Province: "福建省",
			City:     "厦门市",
			District: "思明区",
		},
		&VaccinationSite{
			Name:     "集美区接种点",
			Address:  "集美区",
			Province: "福建省",
			City:     "厦门市",
			District: "集美区",
		},
	}

	said := 12000000

	for _, site := range sites {
		_, err := db.Model(site).Insert()
		if err != nil {
			fmt.Printf("err: %s\n", err)
		}

		for i := 0; i < 3; i++ {
			sa := &VaccinationSiteAdmin{
				Account:           strconv.Itoa(said),
				VaccinationSiteID: site.(*VaccinationSite).ID,
				PassHash:          phash,
				Name:              firstNames[rand.Intn(len(firstNames))] + lastNames[rand.Intn(len(lastNames))],
				Phone:             strconv.Itoa(phone),
			}
			said++
			phone++

			_, _ = db.Model(sa).Insert()
		}

		vis := []interface{}{
			&VaccineInventory{
				VaccineID:         1,
				VaccinationSiteID: site.(*VaccinationSite).ID,
				Number:            8000,
			},
			&VaccineInventory{
				VaccineID:         2,
				VaccinationSiteID: site.(*VaccinationSite).ID,
				Number:            8000,
			},
			&VaccineInventory{
				VaccineID:         4,
				VaccinationSiteID: site.(*VaccinationSite).ID,
				Number:            8000,
			},
			&VaccineInventory{
				VaccineID:         5,
				VaccinationSiteID: site.(*VaccinationSite).ID,
				Number:            8000,
			},
		}

		for _, vi := range vis {
			_, _ = db.Model(vi).Insert()
		}
	}

	pn := 350104200000000000

	for i := 1; i < 13; i++ {
		vd := time.Date(2021, time.Month(i), 10, 22, 22, 33, 0, time.Local).Unix()
		vt := rand.Intn(100) + 600

		for j := 0; j < vt; j++ {
			vl := &VaccinationLog{
				VaccineID:         1,
				VaccinationSiteID: rand.Intn(len(sites)) + 1,
				PersonIDNumber:    strconv.Itoa(pn),
				Time:              vd,
				VaccinationTimes:  1,
			}
			pn++

			_, _ = db.Model(vl).Insert()
		}
	}

	for i := 1; i < 13; i++ {
		vd := time.Date(2021, time.Month(i), 10, 14, 22, 33, 0, time.Local).Unix()
		vt := rand.Intn(100) + 500

		for j := 0; j < vt; j++ {
			vl := &VaccinationLog{
				VaccineID:         3,
				VaccinationSiteID: rand.Intn(len(sites)) + 1,
				PersonIDNumber:    strconv.Itoa(pn),
				Time:              vd,
				VaccinationTimes:  1,
			}
			pn++

			_, _ = db.Model(vl).Insert()
		}
	}

	for i := 1; i < 13; i++ {
		vd := time.Date(2021, time.Month(i), 10, 14, 22, 33, 0, time.Local).Unix()
		vt := rand.Intn(100) + 300

		for j := 0; j < vt; j++ {
			vl := &VaccinationLog{
				VaccineID:         2,
				VaccinationSiteID: rand.Intn(len(sites)) + 1,
				PersonIDNumber:    strconv.Itoa(pn),
				Time:              vd,
				VaccinationTimes:  1,
			}
			pn++

			_, _ = db.Model(vl).Insert()
		}
	}

	for i := 1; i < 13; i++ {
		vd := time.Date(2021, time.Month(i), 15, 14, 22, 33, 0, time.Local).Unix()
		vt := rand.Intn(100) + 200

		for j := 0; j < vt; j++ {
			vl := &VaccinationLog{
				VaccineID:         rand.Intn(2) + 4,
				VaccinationSiteID: rand.Intn(len(sites)) + 1,
				PersonIDNumber:    strconv.Itoa(pn),
				Time:              vd,
				VaccinationTimes:  1,
			}
			pn++

			_, _ = db.Model(vl).Insert()
		}
	}

	for i := 1; i < 13; i++ {
		vd := time.Date(2021, time.Month(i), 15, 9, 22, 33, 0, time.Local).Unix()
		vt := rand.Intn(100) + 100

		for j := 0; j < vt; j++ {
			vl := &VaccinationLog{
				VaccineID:         6,
				VaccinationSiteID: rand.Intn(len(sites)) + 1,
				PersonIDNumber:    strconv.Itoa(pn),
				Time:              vd,
				VaccinationTimes:  1,
			}
			pn++

			_, _ = db.Model(vl).Insert()
		}
	}

	dates := []time.Time{
		time.Date(2021, 11, 30, 23, 59, 59, 0, time.Local),
		time.Date(2021, 12, 30, 23, 59, 59, 0, time.Local),
		time.Date(2022, 1, 30, 23, 59, 59, 0, time.Local),
	}

	dateBefore := time.Date(2021, 9, 30, 23, 59, 59, 0, time.Local)

	pn = 350104200000000000

	for i := 1; i < len(sites)+1; i++ {
		bookA := rand.Intn(20) + 50
		bookB := rand.Intn(20) + 50

		aa := &AppointmentArrangement{
			VaccineID:         1,
			VaccinationSiteID: i,
			Date:              dateBefore.Unix(),
			TotalNumber:       1000,
			BookedNumber:      bookA,
			BookID:            bookA + bookB - 1,
		}

		_, _ = db.Model(aa).Insert()

		aa = &AppointmentArrangement{
			VaccineID:         2,
			VaccinationSiteID: i,
			Date:              dateBefore.Unix(),
			TotalNumber:       1000,
			BookedNumber:      bookB,
			BookID:            bookA + bookB - 1,
		}

		_, _ = db.Model(aa).Insert()

		j := 1

		for ; j < 101; j++ {
			appo := &VaccinationAppointment{
				PersonIDNumber:    strconv.Itoa(pn),
				VaccineID:         rand.Intn(2) + 1,
				VaccinationSiteID: i,
				Date:              dateBefore.Unix(),
				Vaccination:       true,
				AppointmentID:     dateBefore.Year()*1000000000 + int(dateBefore.Month())*10000000 + dateBefore.Day()*100000 + j,
			}

			pn++

			_, _ = db.Model(appo).Insert()
		}

		for ; j < bookA+bookB+1; j++ {
			appo := &VaccinationAppointment{
				PersonIDNumber:    strconv.Itoa(pn),
				VaccineID:         rand.Intn(2) + 1,
				VaccinationSiteID: i,
				Date:              dateBefore.Unix(),
				Vaccination:       false,
				AppointmentID:     dateBefore.Year()*1000000000 + int(dateBefore.Month())*10000000 + dateBefore.Day()*100000 + j,
			}

			pn++

			_, _ = db.Model(appo).Insert()
		}
	}

	for i := 1; i < len(sites)+1; i++ {
		for _, date := range dates {
			bookA := rand.Intn(20) + 50
			bookB := rand.Intn(20) + 50

			aa := &AppointmentArrangement{
				VaccineID:         1,
				VaccinationSiteID: i,
				Date:              date.Unix(),
				TotalNumber:       1000,
				BookedNumber:      bookA,
				BookID:            bookB,
			}

			_, _ = db.Model(aa).Insert()

			aa = &AppointmentArrangement{
				VaccineID:         2,
				VaccinationSiteID: i,
				Date:              date.Unix(),
				TotalNumber:       1000,
				BookedNumber:      bookB,
				BookID:            bookB,
			}

			_, _ = db.Model(aa).Insert()

			for j := 1; j < bookA+bookB+1; j++ {
				appo := &VaccinationAppointment{
					PersonIDNumber:    strconv.Itoa(pn),
					VaccineID:         rand.Intn(2) + 1,
					VaccinationSiteID: i,
					Date:              date.Unix(),
					Vaccination:       false,
					AppointmentID:     date.Year()*1000000000 + int(date.Month())*10000000 + date.Day()*100000 + j,
				}

				pn++

				_, _ = db.Model(appo).Insert()
			}
		}
	}

}

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

func main() {
	DBCreateTable()
	InsertSomeData()
}
