import { ObjectiveLayout } from '../../components/ObjectiveLayout'
import { SkillProgress } from '../../components/SkillProgress'
import { SectionCard } from '../../components/SectionCard'
import { useWiseOldMan } from '../../hooks/useWiseOldMan'
import { DEFAULT_RSN } from '../../services/config'

export function MaxHousePage() {
  const wom = useWiseOldMan(DEFAULT_RSN)
  return (
    <ObjectiveLayout title="Max House" icon="Construction icon" tagline="Fastest route to a maxed player-owned house">
      <SectionCard title="Live progress" icon="Construction icon">
        <SkillProgress wom={wom} skill="construction" skillIconName="Construction icon" />
      </SectionCard>
      {/* Sections are populated from verified wiki data in data.ts */}
    </ObjectiveLayout>
  )
}
