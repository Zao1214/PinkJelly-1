require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const chaiHttp = require('chai-http');

const app = require('../index');
const formatToUsableData = require('../formatToUsableData');
const formatHelper = require('../formatHelper');
const getImageSize = require('../getImageSize');
const downloadS3 = require('../downloadS3');
const runDarknet = require('../runDarknet');

const testEmail = 'test@test.com';
const wrongTestEmail = 'test.com';
const simpleYoloType = 'simple';
const funnyYoloType = 'funny';
const wrongYoloType = 'wrong';
const imageUrlS3 = `${process.env.AWS_S3_BUCKET_IMAGE_URL}/${testEmail}-image.jpg`;

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const expect = chai.expect;
chai.should();

// ***istanbul doesnt read =>(arrow) functions as functions***
describe('#functions in this server', () => {

  let data = 'one 69, 161, 252, 310 \none two 911, 202, 1057, 411 \none two three 431, 213, 1422, 123 \none two three four 100, 200, 300, 400 \none two three four five 100, 200, 300, 400 \none two three four five six 100, 200, 300, 400 \n';
  
  const imageSize = { height: 100, width: 100 };

  describe('formatToUsableData', () => {

    it('should export a function that returns an array', () => {
      expect(formatToUsableData).to.be.a('function');
      expect(formatToUsableData(data, imageSize)).to.be.an('array');
    });
    
  });

  describe('formatHelper', () => {

    let testData = data.replace(/]|\[|,/g, '');
    testData = testData.split('\n');
    testData.pop();
    const newTestData = [];
    testData.forEach((eachData) => {
      eachData = eachData.split(' ');
      eachData.pop();
      newTestData.push(eachData);
    });

    it('should export a function that returns an object', () => {
      expect(formatHelper).to.be.a('function');
      newTestData.forEach((eachNewData) => {
        expect(formatHelper((eachNewData, eachNewData.length, imageSize.height, imageSize.width))).to.be.an('object');
      });
    });

  });

  describe('getImageSize', () => {

    it('should return an object with properties of "height" and "width"', (done) => {
      Promise.all([
        getImageSize(imageUrlS3).should.eventually.have.property('height'),
        getImageSize(imageUrlS3).should.eventually.have.property('width')
      ]).should.notify(done);
    }).timeout(10000);
  });

  describe('downlaodS3', () => {

    it('should fail when given invalid parameters', () => {
      expect(downloadS3(`wrong uri`, `./darknet/${testEmail}-super.jpg`, () => console.log('download complete'))).to.equal('downloadS3 invalid uri');
      expect(downloadS3(`${process.env.AWS_S3_BUCKET_IMAGE_URL}/${testEmail}-image.jpg`, `wrong filename`, () => console.log('download complete'))).to.equal('downloadS3 invalid filename');
    });
  })

});

describe('#POST check', () => {

  it('should only return an array of object(s) when given valid parameters', (done) => {
    chai.request(app)
    .post('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      runDarknet(testEmail, wrongYoloType).should.eventually.be.rejected;
      runDarknet(wrongTestEmail, funnyYoloType).should.eventually.be.rejected;
      runDarknet(testEmail, funnyYoloType).should.eventually.be.an('array');
      runDarknet(testEmail, funnyYoloType).should.eventually.have.property('label');
      runDarknet(testEmail, funnyYoloType).should.eventually.have.property('x');
      runDarknet(testEmail, funnyYoloType).should.eventually.have.property('y');
      runDarknet(testEmail, funnyYoloType).should.eventually.have.property('height');
      runDarknet(testEmail, funnyYoloType).should.eventually.have.property('width');
      runDarknet(testEmail, simpleYoloType).should.eventually.be.an('array');
      runDarknet(testEmail, simpleYoloType).should.eventually.have.property('label');
      runDarknet(testEmail, simpleYoloType).should.eventually.have.property('x');
      runDarknet(testEmail, simpleYoloType).should.eventually.have.property('y');
      runDarknet(testEmail, simpleYoloType).should.eventually.have.property('height');
      runDarknet(testEmail, simpleYoloType).should.eventually.have.property('width');
      done();
    });
  }).timeout(15000);

  it('should fail with invalid userEmail', (done) => {
    chai.request(app)
    .post('/')
    .type('form')
    .send({
      userEmail: wrongTestEmail,
      yoloType: funnyYoloType,
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      done();
    });
  });

  it('should fail with invalid yoloType', (done) => {
    chai.request(app)
    .post('/')
    .type('form')
    .send({
      userEmail: testEmail,
      yoloType: wrongYoloType,
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      done();
    });
  });

});
