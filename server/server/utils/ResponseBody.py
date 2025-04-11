class ResponseBody:
    @staticmethod
    def build(data: dict, status: int):
        return {"response": data, "status": status}
