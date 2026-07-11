import { useMemo, useRef, useState } from 'react'
import { ObjectiveLayout } from '../../components/ObjectiveLayout'
import { Note, SectionCard, Tag } from '../../components/SectionCard'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { BlockView, btnStyle } from './BlockEditor'
import { blockItems, buildClaudePrompt, emptyBlock, uid, type EmbedBlock, type Goal, type NoteDoc } from './types'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return true
    } catch {
      return false
    }
  }
}

const inputStyle: React.CSSProperties = {
  background: '#111', color: 'var(--parchment)', border: '1px solid var(--stone-5)',
  borderRadius: 4, padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-body)',
}
const textareaStyle: React.CSSProperties = { ...inputStyle, width: '100%', minHeight: 70, resize: 'vertical', lineHeight: 1.5 }

function AddBlockButtons({ onAdd }: { onAdd: (b: EmbedBlock) => void }) {
  return (
    <span style={{ display: 'inline-flex', gap: 6 }}>
      <button style={btnStyle} onClick={() => onAdd(emptyBlock('inventory'))}>+ 🎒 Inventory</button>
      <button style={btnStyle} onClick={() => onAdd(emptyBlock('loadout'))}>+ 🛡 Loadout</button>
    </span>
  )
}

// ── Goals ─────────────────────────────────────────────────────────────────

function GoalRow({
  goal,
  onChange,
  onDelete,
  dragHandlers,
  dragging,
}: {
  goal: Goal
  onChange: (g: Goal) => void
  onDelete: () => void
  dragHandlers: React.HTMLAttributes<HTMLDivElement>
  dragging: boolean
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <div
      {...dragHandlers}
      style={{
        background: dragging ? '#26221a' : '#161616',
        border: '1px solid #2e2a1e',
        borderLeft: `3px solid ${goal.done ? 'var(--green-dim)' : 'var(--gold)'}`,
        borderRadius: 6,
        padding: '0.6rem 0.9rem',
        marginBottom: 6,
        opacity: dragging ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span title="Drag to reorder" style={{ cursor: 'grab', color: 'var(--parchment-dim)', fontSize: 14, userSelect: 'none' }}>⋮⋮</span>
        <input
          type="checkbox"
          checked={goal.done}
          onChange={(e) => onChange({ ...goal, done: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: 'var(--green-dim)', cursor: 'pointer' }}
        />
        <input
          value={goal.title}
          onChange={(e) => onChange({ ...goal, title: e.target.value })}
          style={{
            ...inputStyle, border: 'none', background: 'transparent', flex: 1, minWidth: 180,
            fontWeight: 600, fontSize: 14,
            color: goal.done ? 'var(--parchment-dim)' : 'var(--gold-light)',
            textDecoration: goal.done ? 'line-through' : 'none',
          }}
        />
        <button style={btnStyle} onClick={() => setOpen(!open)}>
          {open ? '▾' : '▸'} {goal.notes || goal.blocks.length ? 'Details' : 'Add details'}
        </button>
        <button
          style={{ ...btnStyle, borderColor: 'var(--gold-dim)', color: 'var(--gold)' }}
          title="Copy a Claude prompt that turns this goal into a full wiki-verified guide (skills-aligned)"
          onClick={async () => {
            setCopied(await copyText(buildClaudePrompt(goal)))
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          {copied ? '✓ Copied' : '⚒ Claude prompt'}
        </button>
        <button style={{ ...btnStyle, color: '#e06060' }} onClick={onDelete} title="Delete goal">✕</button>
      </div>
      {open && (
        <div style={{ marginTop: 8, paddingLeft: 26 }}>
          <textarea
            value={goal.notes}
            onChange={(e) => onChange({ ...goal, notes: e.target.value })}
            placeholder="Notes — requirements, plan, links…"
            style={textareaStyle}
          />
          <div style={{ marginTop: 6 }}>
            <AddBlockButtons onAdd={(b) => onChange({ ...goal, blocks: [...goal.blocks, b] })} />
          </div>
          {goal.blocks.map((b) => (
            <BlockView
              key={b.id}
              block={b}
              onChange={(nb) => onChange({ ...goal, blocks: goal.blocks.map((x) => (x.id === nb.id ? nb : x)) })}
              onDelete={() => onChange({ ...goal, blocks: goal.blocks.filter((x) => x.id !== b.id) })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GoalsSection() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('dashscape.goals.v1', [])
  const [newTitle, setNewTitle] = useState('')
  const dragFrom = useRef<number | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const add = () => {
    const title = newTitle.trim()
    if (!title) return
    setGoals((g) => [...g, { id: uid(), title, done: false, notes: '', blocks: [], createdAt: Date.now() }])
    setNewTitle('')
  }

  const move = (from: number, to: number) => {
    if (from === to) return
    setGoals((g) => {
      const next = [...g]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const doneCount = goals.filter((g) => g.done).length

  return (
    <SectionCard title={`Goals ${goals.length ? `— ${doneCount}/${goals.length} done` : ''}`} icon="Quest point icon">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder='Add a goal… e.g. "Unlock Ornate jewellery box", "Quest cape", "Fire cape on the alt"'
          style={{ ...inputStyle, flex: 1, minWidth: 260 }}
        />
        <button style={{ ...btnStyle, padding: '6px 16px', fontSize: 13 }} onClick={add}>+ Add</button>
      </div>
      {goals.length === 0 && (
        <p className="muted" style={{ fontSize: 12.5 }}>
          Nothing yet. Add short named goals; expand one to write notes or attach an inventory/loadout; drag ⋮⋮ to
          re-order; tick when done. The ⚒ button copies a prompt that asks Claude to expand the goal into a full
          wiki-verified guide like Max House or Slayer.
        </p>
      )}
      {goals.map((g, i) => (
        <GoalRow
          key={g.id}
          goal={g}
          dragging={draggingId === g.id}
          onChange={(ng) => setGoals((all) => all.map((x) => (x.id === ng.id ? ng : x)))}
          onDelete={() => setGoals((all) => all.filter((x) => x.id !== g.id))}
          dragHandlers={{
            draggable: true,
            onDragStart: (e) => {
              dragFrom.current = i
              setDraggingId(g.id)
              e.dataTransfer.effectAllowed = 'move'
            },
            onDragEnter: () => {
              if (dragFrom.current !== null && dragFrom.current !== i) {
                move(dragFrom.current, i)
                dragFrom.current = i
              }
            },
            onDragOver: (e) => e.preventDefault(),
            onDragEnd: () => {
              dragFrom.current = null
              setDraggingId(null)
            },
          }}
        />
      ))}
    </SectionCard>
  )
}

// ── Notes ─────────────────────────────────────────────────────────────────

function TagChip({ tag, active, onClick }: { tag: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#2a2415' : 'var(--stone-3)',
        color: active ? 'var(--gold-light)' : 'var(--parchment-dim)',
        border: `1px solid ${active ? 'var(--gold-dim)' : 'var(--stone-5)'}`,
        borderRadius: 10, padding: '2px 10px', fontSize: 11, cursor: onClick ? 'pointer' : 'default',
      }}
    >
      #{tag}
    </button>
  )
}

function NoteCard({ note, onChange, onDelete }: { note: NoteDoc; onChange: (n: NoteDoc) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(!note.title && !note.body)
  const [tagsText, setTagsText] = useState(note.tags.join(', '))

  const commitTags = (text: string) => {
    setTagsText(text)
    const tags = [...new Set(text.split(',').map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean))]
    onChange({ ...note, tags, updatedAt: Date.now() })
  }

  return (
    <div style={{ background: '#161616', border: '1px solid #2e2a1e', borderLeft: '3px solid var(--blue-dim)', borderRadius: 6, padding: '0.8rem 1rem', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {editing ? (
          <input
            value={note.title}
            onChange={(e) => onChange({ ...note, title: e.target.value, updatedAt: Date.now() })}
            placeholder="Note title…"
            style={{ ...inputStyle, fontWeight: 700, flex: 1, minWidth: 200 }}
          />
        ) : (
          <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--gold-light)', flex: 1 }}>{note.title || '(untitled)'}</span>
        )}
        <span style={{ display: 'flex', gap: 6 }}>
          <button style={btnStyle} onClick={() => setEditing(!editing)}>{editing ? '✓ Done' : '✎ Edit'}</button>
          <button style={{ ...btnStyle, color: '#e06060' }} onClick={onDelete}>✕</button>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6, alignItems: 'center' }}>
        {editing ? (
          <input
            value={tagsText}
            onChange={(e) => commitTags(e.target.value)}
            placeholder="tags, comma, separated"
            style={{ ...inputStyle, fontSize: 11.5, padding: '3px 8px', minWidth: 220 }}
          />
        ) : (
          note.tags.map((t) => <TagChip key={t} tag={t} />)
        )}
        <span className="muted" style={{ fontSize: 10.5, marginLeft: 'auto' }}>
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>
      {editing ? (
        <textarea
          value={note.body}
          onChange={(e) => onChange({ ...note, body: e.target.value, updatedAt: Date.now() })}
          placeholder="Write the note…"
          style={{ ...textareaStyle, marginTop: 8 }}
        />
      ) : (
        note.body && <div style={{ marginTop: 8, fontSize: 12.5, whiteSpace: 'pre-wrap' }}>{note.body}</div>
      )}
      <div style={{ marginTop: 8 }}>
        <AddBlockButtons onAdd={(b) => onChange({ ...note, blocks: [...note.blocks, b], updatedAt: Date.now() })} />
      </div>
      {note.blocks.map((b) => (
        <BlockView
          key={b.id}
          block={b}
          onChange={(nb) => onChange({ ...note, blocks: note.blocks.map((x) => (x.id === nb.id ? nb : x)), updatedAt: Date.now() })}
          onDelete={() => onChange({ ...note, blocks: note.blocks.filter((x) => x.id !== b.id), updatedAt: Date.now() })}
        />
      ))}
    </div>
  )
}

function NotesSection() {
  const [notes, setNotes] = useLocalStorage<NoteDoc[]>('dashscape.notes.v1', [])
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const allTags = useMemo(() => [...new Set(notes.flatMap((n) => n.tags))].sort(), [notes])

  const visible = notes.filter((n) => {
    if (activeTags.length && !activeTags.every((t) => n.tags.includes(t))) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    const haystack = [n.title, n.body, ...n.tags, ...n.blocks.flatMap((b) => [b.title, ...blockItems(b)])].join(' ').toLowerCase()
    return haystack.includes(q)
  })

  return (
    <SectionCard title={`Notes ${notes.length ? `— ${visible.length}/${notes.length} shown` : ''}`} icon="Book of knowledge">
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes — titles, text, tags, embedded items…"
          style={{ ...inputStyle, flex: 1, minWidth: 240 }}
        />
        <button
          style={{ ...btnStyle, padding: '6px 16px', fontSize: 13 }}
          onClick={() => setNotes((n) => [{ id: uid(), title: '', tags: [], body: '', blocks: [], updatedAt: Date.now() }, ...n])}
        >
          + New note
        </button>
      </div>
      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: 11 }}>Filter:</span>
          {allTags.map((t) => (
            <TagChip
              key={t}
              tag={t}
              active={activeTags.includes(t)}
              onClick={() => setActiveTags((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]))}
            />
          ))}
          {activeTags.length > 0 && (
            <button style={{ ...btnStyle, fontSize: 10.5 }} onClick={() => setActiveTags([])}>clear</button>
          )}
        </div>
      )}
      {notes.length === 0 && (
        <p className="muted" style={{ fontSize: 12.5 }}>
          No notes yet. Notes have a name, tags, freeform text, and can embed inventories/loadouts — searchable by any
          of it.
        </p>
      )}
      {visible.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onChange={(nn) => setNotes((all) => all.map((x) => (x.id === nn.id ? nn : x)))}
          onDelete={() => setNotes((all) => all.filter((x) => x.id !== n.id))}
        />
      ))}
    </SectionCard>
  )
}

export function GoalsPage() {
  return (
    <ObjectiveLayout title="Goals & Notes" icon="Quest point icon" tagline="Freeform goal tracking, tagged notes, and loadout scratchpads — all saved in your browser">
      <GoalsSection />
      <NotesSection />
      <Note kind="warn">
        Everything on this page lives in this browser's localStorage (<code>dashscape.goals.v1</code> /{' '}
        <code>dashscape.notes.v1</code>). Item autocomplete covers GE-tradeable items; untradeables (quest items,
        capes) can be typed freely and still get wiki icons/links when spelled exactly. The{' '}
        <Tag kind="gold">⚒ Claude prompt</Tag> button copies a skills-aligned brief you can paste into Claude Code to
        turn a goal into a full objective page.
      </Note>
    </ObjectiveLayout>
  )
}
