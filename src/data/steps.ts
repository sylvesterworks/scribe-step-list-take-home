export type Step = {
  id: string;
  title: string;
  description: string;
  /** Hue used by the screenshot placeholder, so cards are visually distinguishable. */
  hue: number;
  /** Locked steps cannot be reordered. */
  locked?: boolean;
};

const RAW: Array<[string, string]> = [
  ['Open the Scribe web app', 'Go to scribehow.com and sign in with your work account.'],
  ['Click Workspace in the left sidebar', 'The sidebar is collapsed on smaller screens — open it with the menu icon.'],
  ['Select Settings', 'Settings sits at the bottom of the workspace list.'],
  ['Choose the Members tab', 'You need admin access to see this tab.'],
  ['Click Invite people', 'The button is in the top right of the members table.'],
  ['Enter the email address', 'You can paste several addresses separated by commas.'],
  ['Pick a role for the new member', 'Viewer, Editor, or Admin. Most people should start as Editor.'],
  ['Click Send invitations', 'Invitations expire after 14 days.'],
  ['Confirm the invite was sent', 'The new member appears in the table with a Pending badge.'],
  ['Open the Teams tab', 'Teams let you group members by function.'],
  ['Click Create team', 'Team names must be unique within the workspace.'],
  ['Name the team', 'Use something people will recognise, like "Support" or "Onboarding".'],
  ['Add members to the team', 'Start typing a name and select from the list.'],
  ['Set the team visibility', 'Private teams are hidden from people outside the team.'],
  ['Click Save', 'Changes take effect immediately.'],
  ['Go back to Settings', 'Use the breadcrumb at the top of the page.'],
  ['Open the Single Sign-On section', 'SSO is available on Enterprise plans.'],
  ['Copy the ACS URL', 'You will paste this into your identity provider.'],
  ['Paste the URL into your IdP', 'In Okta this is the Single sign-on URL field.'],
  ['Copy the metadata URL back into Scribe', 'Scribe validates it as soon as you paste.'],
  ['Click Test connection', 'This opens a new tab and signs you in with SSO.'],
  ['Enable Require SSO', 'Existing password sessions stay active until they expire.'],
  ['Review the domain list', 'Only verified domains can be used for SSO.'],
  ['Add a verified domain', 'You will need a DNS TXT record to verify it.'],
  ['Copy the TXT record', 'The record is unique to your workspace.'],
  ['Add the record in your DNS provider', 'Propagation usually takes a few minutes.'],
  ['Click Verify', 'If verification fails, wait five minutes and try again.'],
  ['Open the Billing tab', 'Billing is only visible to workspace owners.'],
  ['Check the seat count', 'Seats update automatically as people join.'],
  ['Review the plan details', 'You can change plans at any time.'],
  ['Open the Security tab', 'This is where session and export controls live.'],
  ['Set the session timeout', 'The default is 30 days of inactivity.'],
  ['Restrict public sharing', 'Turning this on disables all existing public links.'],
  ['Enable audit logging', 'Logs are retained for 12 months.'],
  ['Download the audit log', 'Exports arrive by email as a CSV.'],
  ['Open the Integrations tab', 'Integrations are configured per workspace, not per user.'],
  ['Connect your identity provider', 'Scribe supports Okta, Entra ID, and Google Workspace.'],
  ['Map group attributes', 'Groups map to Scribe teams by name.'],
  ['Save the integration', 'Scribe runs a sync immediately after saving.'],
  ['Confirm the sync succeeded', 'The status pill turns green when the first sync completes.'],
];

export const steps: Step[] = RAW.map(([title, description], i) => ({
  id: `step-${i + 1}`,
  title,
  description,
  hue: (i * 37) % 360,
  // The first step is the guide's entry point and is pinned in place.
  locked: i === 0,
}));
