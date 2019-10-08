const test = require('ava');

const createWorkflowClient = require('./index');

// So there are 4 tests, one for each scenario
// It would also be OK to do other ones!
// The README didn't actually say these are the right ones ;)

// Simple increment test
test('it should increment a value', (t) => {
  // Setup some test data, it doesn't really matter what
  // It's often a good idea to use other data than what's actually in the specs
  const input = { something: 500 };
  const steps = [{ type: 'increment', key: 'something' }];

  // We create a client then run the workflows
  const runWorkflow = createWorkflowClient();
  // This means we can inject an email client later
  const result = runWorkflow(steps, input);

  // Then just check the result was what we expected!
  t.deepEqual(result, { something: 501 });
});

test('it should set a value', (t) => {
  // You should have got the idea by now
  // The key thing is this is just an example
  // The actual implementation in real life would be much more complex
  // But you have to start somewhere - and choosing where to start is one of the hardest parts!
  const input = { someKey: 'a value' };

  const expectedValue = 'A different value!';
  const expectedKey = 'otherKey';

  const steps = [
    { type: 'set', key: expectedKey, value: expectedValue },
  ];

  const runWorkflow = createWorkflowClient();
  const result = runWorkflow(steps, input);

  t.deepEqual(result, {
    someKey: 'a value',
    [expectedKey]: expectedValue,
  });
});

test('it should set a field based on a secondary parameter', (t) => {
  const input = { testData: 'can be basically anything' };

  const additionalData = 'this could be extra data provided by the user';

  const expectedKey = 'extraData';

  const steps = [
    { type: 'setFromExtraData', key: expectedKey },
  ];

  const runWorkflow = createWorkflowClient();
  // You'll note that the parameters were other way around from the way given in the scaffold
  // This is ok, it just felt better this way around :)
  const result = runWorkflow(steps, input, additionalData);

  t.deepEqual(result, {
    testData: 'can be basically anything',
    [expectedKey]: additionalData,
  });
});

test('it should send an email', (t) => {
  const expectedEmail = 'an@example.email';

  const input = {
    sendTo: expectedEmail,
  };

  const steps = [
    { type: 'sendEmail', to: 'sendTo' },
  ];

  // This is an interesting way to write a test
  // We're injecting a fake client, but you could also do this with a test spy
  // In real life we'd probably even override a module somewhere for "test mode"!
  const fakeEmailClient = (sendTo) => {
    t.is(sendTo, expectedEmail);

    t.pass();
  };

  // Also this would probably be async in a full solution, but for a small test this isn't expected
  // I just expected you to note that it _could_ be async
  // If it were we only need a few 'async' keywords and bluebird's Promise.reduce :)
  const runWorkflow = createWorkflowClient({
    emailClient: fakeEmailClient,
  });

  runWorkflow(steps, input);
});

// Hope this was a small help in understanding what a solution _could_ be!
// There isn't really a 'correct' solution
// Understanding that and setting reasonable boundaries is a large part of the test! 
