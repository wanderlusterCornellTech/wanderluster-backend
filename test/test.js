var request = require("supertest");
var should = require("should");

describe("SAMPLE unit test",function(){

		var url = 'http://54.86.181.199:80';
		// #1 should return home page
		var body = {};
		it('Login Success', function(done){
				request(url)
				.get('/api/login/lx123/123456')
				.send(body)
				.expect(200) //Status code
				.end(function(err,res) {
						if (err) {
						throw err;
						}
						// Should.js fluent syntax applied
						res.body.message.should.equal('Login Success!')
						done();
						});
				});

		it('Login Fail', function(done){
				request(url)
				.get('/api/login/shimiao123/654321')
				.send(body)
				.expect(200) //Status code
				.end(function(err,res) {
						if (err) {
						throw err;
						}
						res.body.message.should.equal('Username or Password invalid')
                                                done();
						});
				});
		
		/**it('Register Success', function(done) {
				request(url)
				.post('/api/register/abcd/123456')
				.send(body)
				.expect(200)
				.end(function(err,res) {
					if (err) {
					throw err;
					}
					res.body.message.should.equal('Success!')
					done();
					});
			});**/
		
		it('Register Fail', function(done){
				request(url)
				.post('/api/register/lx123/123456')
				.send(body)
				.expect(200) //Status code
				.end(function(err,res) {
						if (err) {
						throw err;
						}
						// Should.js fluent syntax applied
						res.body.message.should.equal('Username has been used')
						done();
						});
				});
			

});
