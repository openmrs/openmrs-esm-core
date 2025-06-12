import React, { useState } from 'react';
import { TextInput, Button, InlineNotification } from '@carbon/react';

const LoginWithSecret: React.FC = () => {
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement secret question authentication logic
    setError('Not implemented yet.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login with Secret Question</h2>
      <TextInput
        id="username"
        labelText="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextInput
        id="question"
        labelText="Secret Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <TextInput
        id="answer"
        labelText="Answer"
        type="password"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
      />
      <Button type="submit" style={{ marginTop: 16 }}>
        Login
      </Button>
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
          style={{ marginTop: 16 }}
        />
      )}
    </form>
  );
};

export default LoginWithSecret;
