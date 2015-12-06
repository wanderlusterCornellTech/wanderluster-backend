var request = require("supertest");
var should = require("should");

describe("SAMPLE unit test",function(){

var url = 'http://localhost:80';
  // #1 should return home page

  it('should get user', function(done){
            request(url)
                .get('/api')
                //.send(body)
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.status.should.equal(200);
                    done();
                });
        });
});
