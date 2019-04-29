import Mock from "mockjs";

Mock.setup({
    timeout: '10-250'
})

Mock.mock("/api/login","post", {
    "code": 0,
    "msg": "success",
    "data": {
    "server": "mock"
    }
})

Mock.mock("/api/test", {
    "code": 0,
    "msg": "success",
    "data": {
        "server": "mock"
    }
})