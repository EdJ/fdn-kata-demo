// Just pretend this is plugged in for real :)
// We're going to override it anyway in the test!
const defaultEmailClient = () => Promise.resolve();

// So we wrap the workflow handler in setup function so we can inject the email client
// This isn't always the best idea, but it's simple enough for our short example
const createWorkflowClient = ({
  // If we pass an email client we use that, otherwise the default one
  emailClient = defaultEmailClient,
  // Also if we don't pass config just default it to empty
} = {}) => {
  // These are our definitions for each type of step
  const stepDefinitions = {
    increment: (input, step) => (
      Object.assign(
        {},
        input,
        { [step.key]: input[step.key] + 1 },
      )
    ),
    set: (input, step) => (
      Object.assign(
        {},
        input,
        { [step.key]: step.value },
      )
    ),
    setFromExtraData: (input, step, additionalInput) => (
      Object.assign(
        {},
        input,
        { [step.key]: additionalInput },
      )
    ),
    sendEmail: (input, step) => {
      const sendTo = input[step.to];

      emailClient(sendTo);
    },
  };

  // This function actually handles the workflows!
  return (steps, input, additionalInput) => (
    steps.reduce((output, step) => {
      // For each step, we get the handler function for the relevant step type
      const toRun = stepDefinitions[step.type];

      // Then we run it on the output from the previous step, and return its output
      return toRun(output, step, additionalInput);
    }, Object.assign({}, input))
  );
};

module.exports = createWorkflowClient;
