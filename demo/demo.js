var fs = require('fs');
var path = require('path');
var COS = require('../index');
var util = require('./util');
var config = require('./config');

var cos = new COS({
    AppId: config.AppId,
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
});

function getService() {
    cos.getService(function (err, data) {
        return console.log(err || data);
    });
}

function getAuth() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    var key = '1mb.zip';
    var auth = cos.getAuth({
        Method: 'get',
        Key: key
    });
    console.log('http://' + Bucket + '-' + AppId + '.' + config.Region + '.myqcloud.com' + '/' + key + '?sign=' + encodeURIComponent(auth));
}

function putBucket() {
    cos.putBucket({
        Bucket: 'testnew',
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getBucket() {
    cos.getBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }

        console.log(JSON.stringify(data, null, '  '));
    });
}

function headBucket() {
    cos.headBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putBucketACL() {
    cos.putBucketACL({
        Bucket: config.Bucket,
        Region: config.Region,
        // GrantFullControl: 'uin="1001", uin="1002"',
        // GrantWrite: 'uin="1001", uin="1002"',
        // GrantRead: 'uin="1001", uin="1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        ACL: 'private'
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getBucketACL() {
    cos.getBucketACL({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putBucketCORS() {
    //  该接口存在问题，Content-MD5 错误
    cos.putBucketCORS({
        Bucket: config.Bucket,
        Region: config.Region,
        CORSRules: [{
            "AllowedOrigin": ["*"],
            "AllowedMethod": ["GET", "POST", "PUT", "DELETE", "HEAD"],
            "AllowedHeader": ["origin", "accept", "content-type", "authorzation"],
            "ExposeHeader": ["ETag"],
            "MaxAgeSeconds": "300"
        }]
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getBucketCORS() {
    cos.getBucketCORS({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putBucketTagging() {
    cos.putBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Tags: [{
            Key: 'tagA',
            Value: 123,
        }, {
            Key: 'tagB',
            Value: 456,
        }]
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getBucketTagging() {
    cos.getBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Tags: [{
            Key: 'tagA',
            Value: 123,
        }, {
            Key: 'tagB',
            Value: 456,
        }]
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function deleteBucketTagging() {
    cos.deleteBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putBucketPolicy() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    cos.putBucketPolicy({
        Policy: {
            "version": "2.0",
            "principal": {"qcs": ["qcs::cam::uin/909600000:uin/909600000"]}, // 这里的 909600000 是 QQ 号
            "statement": [
                {
                    "effect": "allow",
                    "action": [
                        "name/cos:GetBucket",
                        "name/cos:PutObject",
                        "name/cos:PostObject",
                        "name/cos:PutObjectCopy",
                        "name/cos:InitiateMultipartUpload",
                        "name/cos:UploadPart",
                        "name/cos:UploadPartCopy",
                        "name/cos:CompleteMultipartUpload",
                        "name/cos:AbortMultipartUpload",
                        "name/cos:AppendObject"
                    ],
                    // "resource": ["qcs::cos:cn-south:uid/1250000000:test-1250000000.cn-south.myqcloud.com//1250000000/test/*"] // 1250000000 是 appid
                    "resource": ["qcs::cos:" + config.Region + ":uid/" + AppId + ":" + Bucket + "-" + AppId + "." + config.Region + ".myqcloud.com//" + AppId + "/" + Bucket + "/*"] // 1250000000 是 appid
                }
            ]
        },
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            getBucketPolicy();
        }
    });
}

function getBucketPolicy() {
    cos.getBucketPolicy({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, '  '));
        }
    });
}

function getBucketLocation() {
    cos.getBucketLocation({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getBucketLifecycle() {
    cos.getBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putBucketLifecycle() {
    cos.putBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region,
        Rules: [{
            'ID': 1,
            'Prefix': 'test',
            'Status': 'Enabled',
            'Transition': {
                'Date': '2016-10-31T00:00:00+08:00',
                'StorageClass': 'Standard_IA'
            }
        }, {
            'ID': 2,
            'Prefix': 'abc',
            'Status': 'Enabled',
            'Transition': {
                'Days': '0',
                'StorageClass': 'Nearline'
            }
        }]
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function deleteBucketLifecycle() {
    cos.deleteBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function deleteBucket() {
    cos.deleteBucket({
        Bucket: 'testnew',
        Region: config.Region
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putObject() {
    // 创建测试文件
    var filename = '1mb.zip';
    var filepath = path.resolve(__dirname, filename);
    util.createFile(filepath, 1024 * 1024 * 1, function (err) {
        // 调用方法
        cos.putObject({
            Bucket: config.Bucket, /* 必须 */
            Region: config.Region,
            Key: filename, /* 必须 */
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },
            // 格式1. 传入文件内容
            // Body: fs.readFileSync(filepath),
            // 格式2. 传入文件流，必须需要传文件大小
            // Body: fs.createReadStream(filepath),
            // ContentLength: fs.statSync(filepath).size
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(JSON.stringify(data, null, '  '));
            }
            fs.unlinkSync(filepath);
        });
    });
}

function putObjectCopy() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    cos.putObjectCopy({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.copy.zip',
        CopySource: Bucket + '-' + AppId + '.' + config.Region + '.myqcloud.com/1mb.zip',
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, '  '));
        }
    });
}

function getObject() {
    var filepath = path.resolve(__dirname, '1mb.out.zip');
    cos.getObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        // 格式1. 传文件路径
        FilePath: filepath,
        // 格式2：传写文件流
        // Output: fs.createWriteStream(filepath)
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function headObject() {
    cos.headObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function putObjectACL() {
    cos.putBucketACL({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        // GrantFullControl: 'uin="1001", uin="1002"',
        // GrantWrite: 'uin="1001", uin="1002"',
        // GrantRead: 'uin="1001", uin="1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        ACL: 'private'
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function getObjectACL() {
    cos.getObjectACL({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function deleteObject() {
    cos.deleteObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }

        console.log(JSON.stringify(data, null, '  '));
    });
}

function deleteMultipleObject() {
    cos.deleteMultipleObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Objects: [
            {Key: '1mb.zip'},
            {Key: '3mb.zip'},
        ]
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data, null, '  '));
    });
}

function abortUploadTask() {
    cos.abortUploadTask({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region, /* 必须 */
        // 格式1，删除单个上传任务
        // Level: 'task',
        // Key: '100mb.zip',
        // UploadId: '14985543913e4e2642e31db217b9a1a3d9b3cd6cf62abfda23372c8d36ffa38585492681e3',
        // 格式2，删除单个文件所有未完成上传任务
        Level: 'file',
        Key: '1mb.zip',
        // 格式3，删除 Bucket 下所有未完成上传任务
        // Level: 'bucket',
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(data, null, '  '));
        }
    });
}

function sliceUploadFile() {
    // 创建测试文件
    var filename = '10mb.zip';
    var filepath = path.resolve(__dirname, filename);
    util.createFile(filepath, 1024 * 1024 * 10, function (err) {
        // 调用方法
        cos.sliceUploadFile({
            Bucket: config.Bucket, /* 必须 */
            Region: config.Region,
            Key: filename, /* 必须 */
            FilePath: filepath, /* 必须 */
            SliceSize: 1024 * 1024,  //1MB  /* 非必须 */
            AsyncLimit: 5, /* 非必须 */
            onHashProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(JSON.stringify(data, null, '  '));
            }
            fs.unlinkSync(filepath);
        });
    });
}

// getService();
// getAuth();
// putBucket();
// getBucket();
// headBucket();
// putBucketACL();
// getBucketACL();
// putBucketCORS();
// getBucketCORS();
// putBucketTagging();
// getBucketTagging();
// deleteBucketTagging();
// putBucketPolicy();
// getBucketPolicy();
// getBucketLocation();
// getBucketLifecycle();
// putBucketLifecycle();
// deleteBucketLifecycle();
// deleteBucket();
// putObject();
// putObjectCopy();
// getObject();
// headObject();
// putObjectACL();
// getObjectACL();
// deleteObject();
// deleteMultipleObject();
// abortUploadTask();
// sliceUploadFile();
