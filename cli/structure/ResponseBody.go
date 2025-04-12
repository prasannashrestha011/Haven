package structure

type ResponseBody struct {
	Message    interface{} `json:"message,omitempty"`
	Error      string      `json:"error,omitempty"`
	StatusCode int         `json:"statuscodess"`
}

type AuthResponseStruct struct {
	RefreshToken       string `json:"refresh"`
	AccessToken        string `json:"access"`
	StorageReferenceID string `json:"storageID"`
}
type ServerResponse struct {
	Response   interface{} `json:"message"`
	StatusCode int         `json:"statuscode"`
}
