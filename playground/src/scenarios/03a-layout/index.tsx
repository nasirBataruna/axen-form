/**
 * Scenario 03 — Layout System
 *
 * Demonstrates Grid, Box, Stack, Divider, and Spacer
 * for composing form layouts without external UI libraries.
 */
import { Box, Divider, Grid, Spacer, Stack } from '@axenstudio/axen-form'
import ScenarioLayout from '../../components/ScenarioLayout'

const SOURCE_CODE = `import { Grid, Box, Stack, Divider, Spacer } from '@axenstudio/axen-form'

// 12-column responsive Grid
<Grid container columns={12} spacing={2}>
  <Grid xs={12} sm={6}>Half on tablet+</Grid>
  <Grid xs={12} sm={6}>Half on tablet+</Grid>
  <Grid xs={4}>Third</Grid>
  <Grid xs={4}>Third</Grid>
  <Grid xs={4}>Third</Grid>
</Grid>

// Flex container
<Box display="flex" gap={2} p={2}>
  <div>Item A</div>
  <div>Item B</div>
</Box>

// Vertical stack with consistent spacing
<Stack direction="column" spacing={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Push items apart
<Box display="flex">
  <Logo />
  <Spacer grow />
  <NavLinks />
</Box>`

export default function S03Layout() {
  return (
    <ScenarioLayout
      title="Layout System"
      description="Grid, Box, Stack, Spacer, Divider — all built-in, zero-dependency."
      sourceCode={SOURCE_CODE}
    >
      {/* Grid Layout */}
      <h4 style={{ margin: '0 0 8px' }}>Grid (12-column)</h4>
      <Grid container columns={12} spacing={2}>
        <Grid xs={12} sm={6}>
          <div style={{ background: '#e3f2fd', padding: 12, borderRadius: 4 }}>xs=12, sm=6</div>
        </Grid>
        <Grid xs={12} sm={6}>
          <div style={{ background: '#e8f5e9', padding: 12, borderRadius: 4 }}>xs=12, sm=6</div>
        </Grid>
        <Grid xs={4}>
          <div style={{ background: '#fce4ec', padding: 12, borderRadius: 4 }}>xs=4</div>
        </Grid>
        <Grid xs={4}>
          <div style={{ background: '#fff3e0', padding: 12, borderRadius: 4 }}>xs=4</div>
        </Grid>
        <Grid xs={4}>
          <div style={{ background: '#f3e5f5', padding: 12, borderRadius: 4 }}>xs=4</div>
        </Grid>
      </Grid>

      <Divider style={{ margin: '24px 0' }} />

      {/* Box */}
      <h4 style={{ margin: '0 0 8px' }}>Box (flex container)</h4>
      <Box display="flex" gap={2} p={2} style={{ background: '#f5f5f5', borderRadius: 4 }}>
        <div style={{ background: '#bbdefb', padding: '8px 16px', borderRadius: 4 }}>Item A</div>
        <div style={{ background: '#c8e6c9', padding: '8px 16px', borderRadius: 4 }}>Item B</div>
        <div style={{ background: '#ffccbc', padding: '8px 16px', borderRadius: 4 }}>Item C</div>
      </Box>

      <Divider style={{ margin: '24px 0' }} />

      {/* Stack */}
      <h4 style={{ margin: '0 0 8px' }}>Stack (vertical, spacing=2)</h4>
      <Stack direction="column" spacing={2}>
        <div style={{ background: '#e3f2fd', padding: 8, borderRadius: 4 }}>Stack Item 1</div>
        <div style={{ background: '#e8f5e9', padding: 8, borderRadius: 4 }}>Stack Item 2</div>
        <div style={{ background: '#fff3e0', padding: 8, borderRadius: 4 }}>Stack Item 3</div>
      </Stack>

      <Divider style={{ margin: '24px 0' }} />

      {/* Spacer */}
      <h4 style={{ margin: '0 0 8px' }}>Spacer (push items apart)</h4>
      <Box display="flex" alignItems="center" p={1} style={{ background: '#f5f5f5', borderRadius: 4 }}>
        <div style={{ background: '#bbdefb', padding: '8px 16px', borderRadius: 4 }}>Logo</div>
        <Spacer grow />
        <div style={{ background: '#c8e6c9', padding: '8px 16px', borderRadius: 4 }}>Nav Links</div>
      </Box>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: '0 0 8px' }}>Spacer (fixed gap)</h4>
        <Box display="flex" alignItems="center">
          <button className="btn btn-primary btn-sm">Save</button>
          <Spacer x={3} />
          <button className="btn btn-outline btn-sm">Cancel</button>
        </Box>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      {/* Divider variants */}
      <h4 style={{ margin: '0 0 8px' }}>Divider (horizontal + vertical)</h4>
      <Box display="flex" gap={2} alignItems="center">
        <span>Left</span>
        <Divider orientation="vertical" style={{ height: 20 }} />
        <span>Right</span>
      </Box>
    </ScenarioLayout>
  )
}
