import { ObjectiveLayout } from '../../components/ObjectiveLayout'
import { SkillProgress } from '../../components/SkillProgress'
import { SectionCard } from '../../components/SectionCard'
import { useWiseOldMan } from '../../hooks/useWiseOldMan'
import { DEFAULT_RSN } from '../../services/config'

export function SlayerPage() {
  const wom = useWiseOldMan(DEFAULT_RSN)
  return (
    <ObjectiveLayout title="Slayer" icon="Slayer icon" tagline="Duradel task reference">
      <SectionCard title="Live progress" icon="Slayer icon">
        <SkillProgress wom={wom} skill="slayer" skillIconName="Slayer icon" />
      </SectionCard>
    </ObjectiveLayout>
  )
}
