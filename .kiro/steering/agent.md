# Agent 经验记录

记录实践中遇到过的问题，避免重复犯错。


## @alicloud/tingwu20230930(通义听悟)已踩过的坑

- 服务仅部署在华北2(北京): 无论账号其它资源在哪个地域，endpoint 固定 tingwu.cn-beijing.aliyuncs.com、regionId 用 cn-beijing；不要去读 config.json 里的 region_id(可能是别的地域)。
- 双钥匙: AccessKey(AK/SK)用于 API 签名，AppKey 是听悟控制台创建的项目标识，createTask 必填，二者不是一回事。
- 任务异步: createTask 只是提交，返回 taskId；结果要用 getTaskInfo 轮询 taskStatus 到 COMPLETED，再从 data.result.transcription(一个下载 URL)拿 JSON。
- SDK 真实 bug(实测): getTranscriptionPhrases 解析返回会崩。服务端返回的 wordWeights 是 JSON 对象，但 SDK 把该字段类型声明成 string，@darabonba/typescript 的 cast 做强类型校验，object≠string 直接抛 "type of wordWeights is mismatch"。只要词表非空，官方 get 方法必崩。规避: 用底层 client.callApi(params, req, runtime) 拿原始 body(字段是大驼峰 Data/Phrases/WordWeights)，绕过 cast。list 方法不含 wordWeights 字段所以正常。
- 验证写操作类示例(创建词表/任务)后要清理: 列举 listTranscriptionPhrases -> 逐个 deleteTranscriptionPhrases -> 再列举确认归零，否则会在账号里留残留资源。