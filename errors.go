package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
)

type SErr int

const (
	EOK = SErr(iota)
	EPersonExist
	EAppointmentExist
	EArrangementExist
	EInventoryExist
	EBadCredential
	ECredentialExpired
	EUserNotExist
	EAppointmentNotExist
	EArrangementNotExist
	EPassedDate
	EBadRequest
	EMissingAuthorization
	EPermissionDenied

	EUnknown = SErr(9999)
)

func (err SErr) Error() string {
	return fmt.Sprintf("operation error: %d", int(err))
}

func (err SErr) MarshalJSON() ([]byte, error) {
	return json.Marshal(fmt.Sprintf("%04d", int(err)))
}

func (err *SErr) UnmarshalJSON(b []byte) error {
	if len(b) != 6 {
		return errors.New("bad Error code: invalid length")
	}

	i, e := strconv.Atoi(string(b)[1:5])

	if e != nil {
		return fmt.Errorf("bad Error code: %s", e)
	}

	*err = SErr(i)
	return nil
}
