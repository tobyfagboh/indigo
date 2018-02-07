/**
 * Created by ese.mentie on 2/12/16.
 */

var req =require('requestify'),
    url ='http://localhost:2600/',
    async =require('async')

module.exports = {
    prod_id:null,

    insertproduct:function(name){
        async.waterfall([function(next){
                getproductid(name.prod_name,next)

        },
            function(arg1,ant){
                postproductid(arg1,name,ant)

            }

        ],function(err,response){
            console.log("res= "+response)
        }

        )
    }
};

var getproductid = function(name, cb) {
    var prod_id;
    console.log(url+'productsroute/productbuild/'+name);

    req.get(url+'productsroute/productbuild/'+name).then(function(res){
        prod_id=res.getBody();
        cb(null,prod_id)
    });
};

var postproductid = function(prod,name,cd){
    json= {'prod_name':name}
    console.log(json)
    console.log("prod = "+prod)

    if (prod =='product does not exist'){
        req.post(url+'productsroute/productbuild/',json).then(function(res) {

            module.exports.prod_id =res.getBody()
           cd(null, module.exports.prod_id )
        })
    }
    else{

        module.exports.prod_id=prod
        cd(null, module.exports.prod_id)
    }
};

var post =function(call,json,cb){
    console.log("json ="+JSON.stringify(json))
    request.post(call,json).then(function(res){
        console.log(res.getBody())
        cb(res.getBody())

    })
}
var get =function(call,params){
    if (params){
        call=call+'/'+params
    }

    request.get(call).then(function(res){
        console.log(call)
        // console.log(res.getBody())
        return res.getBody()

    })
}