import { useState } from 'react';

type Phase = 'mount' | 'trigger' | 'render' | 'commit' | null;

interface PhaseInfo {
  title: string;
  description: string;
}

const phaseDescriptions: Record<Exclude<Phase, null>, PhaseInfo> = {
  mount: {
    title: 'Mount',
    description:
      '최초로 컴포넌트를 랜더링할 때, 비교할 이전의 스냅샷이 없습니다. 따라서 리액트는 필요한 모든 DOM 노드들을 만들고 페이지에 삽입합니다.',
  },
  trigger: {
    title: 'Trigger',
    description:
      '"setX" 함수를 호출하면 상태 변경이 트리거됩니다. 이를 통해 리액트에게 상태값이 변경됐다고 알립니다.',
  },
  render: {
    title: 'Render',
    description: `상태가 변경되었기 때문에, UI에 대한 새로운 설명서를 만들어야 합니다! 리액트는 컴포넌트 함수를 재실행하여 새로운 리액트 요소를 생성합니다.
    새로운 스냅샷과 이전의 스냅샷을 비교하여 새로운 스냅샷으로 변경하기 위해 어떤것을 업데이트해야할지 결정합니다.
      `,
  },
  commit: {
    title: 'Commit',
    description:
      'DOM이 업데이트될 필요가 있다면, 리액트는 변경을 수행합니다. (예: 텍스트 노드의 내용 변경, 새로운 노드 생성, 노드 삭제 등등). 변경이 커밋되면 리액트는 idle 상태로 돌아가고 다음 상태변경을 기다립니다.',
  },
};

const styles = {
  container: {
    margin: '2rem 0',
    padding: '2rem',
    background: 'var(--ifm-background-surface-color)',
    borderRadius: '12px',
    border: '1px solid var(--ifm-color-emphasis-300)',
  },
  diagram: {
    width: '100%',
    height: 'auto',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'block',
  },
  description: {
    marginTop: '0.5rem',
    padding: '1.5rem',
    background: 'var(--ifm-color-emphasis-100)',
    borderRadius: '8px',
    borderLeft: '4px solid var(--ifm-color-primary)',
  },
  descriptionTitle: {
    margin: '0 0 1rem 0',
    color: 'var(--ifm-color-primary)',
    fontSize: '1.5rem',
  },
  descriptionText: {
    margin: 0,
    lineHeight: 1.6,
    fontSize: '1rem',
  },
} as const;

export default function ReactLifecycleDiagram() {
  const [selectedPhase, setSelectedPhase] = useState<Phase>('mount');

  return (
    <div style={styles.container}>
      <svg style={styles.diagram} viewBox="0 0 800 700">
        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#666" />
          </marker>
        </defs>

        {/* Mount Box */}
        <g
          onClick={() => setSelectedPhase('mount')}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="300"
            y="30"
            width="200"
            height="70"
            rx="20"
            fill={selectedPhase === 'mount' ? '#ffd966' : '#f5f5f5'}
            stroke={selectedPhase === 'mount' ? '#4a90e2' : '#333'}
            strokeWidth={selectedPhase === 'mount' ? 4 : 2}
            style={{
              transition: 'all 0.3s ease',
            }}
          />
          <text
            x="400"
            y="72"
            fontSize="28"
            fontWeight="600"
            textAnchor="middle"
            fill="#1a1a1a"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Mount
          </text>
        </g>

        {/* Trigger Box - 정삼각형 위쪽 꼭지점 */}
        <g
          onClick={() => setSelectedPhase('trigger')}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="300"
            y="180"
            width="200"
            height="70"
            rx="20"
            fill={selectedPhase === 'trigger' ? '#ffd966' : '#f5f5f5'}
            stroke={selectedPhase === 'trigger' ? '#4a90e2' : '#333'}
            strokeWidth={selectedPhase === 'trigger' ? 4 : 2}
            style={{
              transition: 'all 0.3s ease',
            }}
          />
          <text
            x="400"
            y="222"
            fontSize="28"
            fontWeight="600"
            textAnchor="middle"
            fill="#1a1a1a"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Trigger
          </text>
        </g>

        {/* Render Box - 정삼각형 오른쪽 아래 꼭지점 */}
        <g
          onClick={() => setSelectedPhase('render')}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="520"
            y="450"
            width="200"
            height="70"
            rx="20"
            fill={selectedPhase === 'render' ? '#ffd966' : '#f5f5f5'}
            stroke={selectedPhase === 'render' ? '#4a90e2' : '#333'}
            strokeWidth={selectedPhase === 'render' ? 4 : 2}
            style={{
              transition: 'all 0.3s ease',
            }}
          />
          <text
            x="620"
            y="492"
            fontSize="28"
            fontWeight="600"
            textAnchor="middle"
            fill="#1a1a1a"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Render
          </text>
        </g>

        {/* Commit Box - 정삼각형 왼쪽 아래 꼭지점 */}
        <g
          onClick={() => setSelectedPhase('commit')}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x="80"
            y="450"
            width="200"
            height="70"
            rx="20"
            fill={selectedPhase === 'commit' ? '#ffd966' : '#f5f5f5'}
            stroke={selectedPhase === 'commit' ? '#4a90e2' : '#333'}
            strokeWidth={selectedPhase === 'commit' ? 4 : 2}
            style={{
              transition: 'all 0.3s ease',
            }}
          />
          <text
            x="180"
            y="492"
            fontSize="28"
            fontWeight="600"
            textAnchor="middle"
            fill="#1a1a1a"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Commit
          </text>
        </g>

        {/* Arrows - 직선 */}
        {/* Mount to Trigger */}
        <line
          x1="400"
          y1="102"
          x2="400"
          y2="178"
          stroke="#666"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        {/* Trigger to Render */}
        <line
          x1="498"
          y1="248"
          x2="522"
          y2="452"
          stroke="#666"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        {/* Render to Commit */}
        <line
          x1="518"
          y1="485"
          x2="282"
          y2="485"
          stroke="#666"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        {/* Commit to Trigger */}
        <line
          x1="278"
          y1="448"
          x2="302"
          y2="252"
          stroke="#666"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
      </svg>

      {/* Description Area */}
      {selectedPhase && (
        <div style={styles.description}>
          <h3 style={styles.descriptionTitle}>
            {phaseDescriptions[selectedPhase].title}
          </h3>
          <p style={styles.descriptionText}>
            {phaseDescriptions[selectedPhase].description}
          </p>
        </div>
      )}
    </div>
  );
}
