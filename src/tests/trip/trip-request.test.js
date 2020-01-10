import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { loggedInToken, activeUser, userWithNoTrip, loggedInUser, userWithNoTripToken, createUsers } from '../fixtures/users.fixture';

chai.should();
chai.use(chaiHttp);

describe('/Get view requested trips ', () => {
  before(async () => {
    await createUsers();
  });
  it('App should show requested trip', (done) => {
    chai.request(app)
      .get(`/api/requests/${loggedInUser.id}`)
      .set('Authorization', loggedInToken)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.status.should.be.equal(200);
        res.body.should.have.property('message');
        done();
      });
  });

  it('App should check invalid user ID', (done) => {
    chai.request(app)
      .get('/api/requests/invalid')
      .set('Authorization', loggedInToken)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.status.should.be.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('App should check if user ID exists', (done) => {
    chai.request(app)
      .get('/api/requests/100')
      .set('Authorization', loggedInToken)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.status.should.be.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('App should check if user ID matches signed in ID', (done) => {
    chai.request(app)
      .get(`/api/requests/${activeUser.id}`)
      .set('Authorization', loggedInToken)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.status.should.be.equal(401);
        res.body.should.have.property('message');
        done();
      });
  });

  it('App should check if trip exists for a particular user', (done) => {
    chai.request(app)
      .get(`/api/requests/${userWithNoTrip.id}`)
      .set('Authorization', userWithNoTripToken)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.status.should.be.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });
});
