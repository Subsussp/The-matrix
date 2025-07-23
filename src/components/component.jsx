import { useState } from 'react';

export default function Comp() {
  const [graph, setGraph] = useState({});
  const [fromTopic, setFromTopic] = useState('');
  const [toTopic, setToTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const linkTopics = () => {
    if (!fromTopic || !toTopic) return;
    
    setGraph(prev => {
      const updated = { ...prev };
      if (!updated[fromTopic]) updated[fromTopic] = [];
      if (!updated[fromTopic].includes(toTopic)) {
        updated[fromTopic].push(toTopic);
      }
      return updated;
    });

    setFromTopic('');
    setToTopic('');
  };

  const renderLinks = () => {
    if (!selectedTopic || !graph[selectedTopic]) return <p>No links.</p>;
    return (
      <ul>
        {graph[selectedTopic].map((link, idx) => (
          <li key={idx}>{link}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Topic Graph</h2>
      <div>
        <input
          placeholder="From topic"
          value={fromTopic}
          onChange={e => setFromTopic(e.target.value)}
        />
        <input
          placeholder="To topic"
          value={toTopic}
          onChange={e => setToTopic(e.target.value)}
        />
        <button onClick={linkTopics}>Link Topics</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>📌 Topics</h3>
        {Object.keys(graph).length === 0 && <p>No topics yet.</p>}
        <ul>
          {Object.keys(graph).map((topic, idx) => (
            <li key={idx}>
              <button onClick={() => setSelectedTopic(topic)}>
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTopic && (
        <div>
          <h4>🔗 Links from "{selectedTopic}"</h4>
          {renderLinks()}
        </div>
      )}
    </div>
  );
}
