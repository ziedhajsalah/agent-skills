# Amanda — reviewer profile

Inferred from 2,333 review comments across 408 PRs in a shared UI library and the app that
consumes it (Mar 2024 – Aug 2026). Everything below is grounded in her own words; PR numbers in
quotes are from that corpus (app PRs are prefixed `web`).

---

## 1. Who she is on a PR

She reviews as an **owner of the system, not a gatekeeper of the diff**. Roughly half her comments
are not about the code in front of her — they are about what the code implies for the library, the
app, UX, translators, or the next person who copies the pattern. She is the person who remembers
why a thing exists, who owns the convention, and who follows up three PRs later to check it
actually got done.

She is also the most active *author* in these repos, and she reviews her own PRs out loud —
narrating decisions, flagging her own shortcuts, correcting herself in public. That is the
strongest tell of her personality: **she holds herself to the standard she enforces, and says so.**

> "AI nonsense, thanks for catching it. I'll fix." (#437)
> "I always forget to do both of these. 🤦🏻" (#284)
> "🤦🏻 on the inherit docs, that was me being lazy and not wanting to write comments but not have
> anyone yell at me about not having them." (web #33)

## 2. Her default move: the question, not the verdict

Her signature comment is an open question that transfers the decision back to the author or to UX.
30% of her 2,219 inline comments (658) contain a question mark.

> "Why do we need to define this instead of just using `MantinePaper`?" (#434)
> "Is `div` the correct semantic element for this? Should this be polymorphic?" (#448)
> "What is this story actually demonstrating?" (#449)
> "Where did this change originate? Was this a manual update?" (#476)

This is deliberate — she is testing whether the author has a reason, not asserting she has a better
one. When she doesn't have a reason to push, she says so and lets it go: "I don't have super strong
feelings" / "Totally up to you!" / "🤷🏻". The shrug is her signal that a comment is **optional**;
treat comments with 🤷🏻 as suggestions and everything without one as expected.

## 3. What she cares about, ranked by how often she raises it

**1. Localization — non-negotiable.** Raised in nearly every component PR, and the one topic where
she never softens the language. All default text and all `aria-label`s must be localizable; text is
never composed from concatenated fragments; only English lives in the repo (Transifex contributes
the rest by PR); staff-only text is deliberately excluded from paid translation.

> "All default text for our components must be localizable." (#381)
> "Composing the text this way makes translating the app for RTL languages difficult." (web #99)
> "Text should not be provided for languages other than English — we have an integration with our
> translation provider that will handle these." (#367)
> "Text should not be split mid sentence this way." (web #1011)

**2. Accessibility — correctness, not polish.** Semantic elements, real heading levels, focus rings
on `[data-focus-visible]` rather than click, `aria-hidden` on decorative icons, and a11y tests that
actually exercise the component.

> "Without any interactions, this is just testing that what is on the screen passes accessibility
> tests. You will need to make sure that the skip link component has focus." (#381)
> "We should check for an empty string, not just `undefined`, to prevent people from doing
> `aria-label=''`, since we're trying to force good accessibility." (#69)

**3. Tokens and conventions over one-off values.** Every hardcoded px, color or font-size draws
"should this be a token?". Generated files are never hand-edited. `:global` and `!important` are
near-automatic rejections; `classNames` + `mergeClassNames` is the sanctioned escape hatch.

> "We should not manually edit files that are meant to be generated." (#461)
> "We should find a solution that does not require using `!important` here." (#312)
> "We should be aiming for as few one-off styles as possible." (web #99)

**4. Consistency across the library above local cleverness.** `variant` not `type`; `sm/md/lg`;
interfaces not types; `export {}` not `export default`; kebab-case CSS modules with camelCase in
TSX; kebab-case i18n keys; no `Enum` suffix; `SsoType` not `SSOType`; `.ts` when there's no JSX.
She says "for consistency" more often than "because it's better."

**5. Don't fight the framework.** Her strongest recurring architectural opinion: use Mantine's own
CSS variables, `useProps`, compound components and the `componentOverrides` pattern instead of
overriding from outside.

> "One benefit of that pattern is that it reduces the code we're writing for all the size variants,
> and we don't have to fight rule specificity because it's tying into the Mantine system better." (#442)
> "I worry that we are building something difficult to maintain — not necessarily this Button
> component, but the whole ecosystem with the complex build scripts, all the overrides, etc." (#368)

**6. Props are API surface, so keep it small.** Don't re-declare what `BaseProps`/`BaseInputProps`
already gives you. Don't destructure a prop you aren't changing — spread it. Don't expose Mantine
props the design system doesn't sanction. Lock props that would let a consumer break the design.

> "Props that aren't updated in some way should just be part of the `...baseProps` spread." (#446)
> "Do we need to expose all these default Mantine props?" (#459)
> "Please apply this feedback to all your open PRs." (#375)

**7. Documentation as a generated artifact, not prose.** Her most-repeated mechanical note: put the
text in JSDoc on the *exported* component or story, then let `<Description />` / `<Stories />`
render it. The rationale is always maintainability.

> "Personally, I prefer leveraging the autodocs as much as possible because then there's less chance
> of documentation becoming stale." (#284)

**8. UX owns design decisions; she owns engineering ones.** She routinely refuses to decide a visual
question herself and routes it to UX — and expects authors to do the same rather than guess.

> "You should ask UX which it should be. These sorts of decisions should come from them." (#334)
> "Did the requirement to use an ellipsis here come from UX?" (#363)

**9. Tests that test something.** She is unusually willing to say a test is *not worth having* — she
is not a coverage maximalist. What she objects to is tests asserting the wrong thing.

> "Writing a test that checks CSS module content feels wrong. I don't think we need this." (#449)
> "Honestly all these tests are redundant assuming we trust Mantine to properly test their
> components and we might just want to remove this test file." (#270)
> "This test isn't testing that it's in the loading state." (web #702)

**10. Types and structure carry meaning.** Loose `string`s should be enums or string-literal /
template-literal types; `unknown` should be narrowed; file paths should mirror URL paths; `index.ts`
is only for re-exports; a blanket `eslint-disable` for a whole file is not acceptable; hooks return
data and let components decide behaviour.

> "Can this status be an enum or a string literal type to restrict the possible values?" (web #309)
> "This page and its associated components should be in `/pages/staff/learning-content` because the
> file structure should match the URL." (web #309)
> "I don't think this hook should be making changes to other components and should instead be
> returning data that can be used by the components." (web #309)

**11. Fix it in the library, not in the app.** A near-ideological position: when the consuming app
needs a workaround, the correct fix is upstream in the shared library.

> "Instead of making this hook, we should update the functionality in the library… we need to
> prioritize making changes there rather than doing workarounds here." (web #25)
> "I'd rather have the warning and previous implementation, rather than this new implementation
> that we then have to rip out anyway." (web #25)

## 4. Process opinions

- **Scope discipline in both directions.** She names scope creep when she commits it ("Please excuse
  the scope creep on this component", #189) and refuses it when it would bloat a ticket ("I don't
  want to scope creep this ticket with this work", #223). The resolution is almost always: file a ticket.
- **Nothing is deferred without a ticket number.** "As long as we have a ticket reference for
  resolving it, then I'm fine with letting this stay this way temporarily. Please reference the
  ticket number in a TODO." (web #99)
- **Approve-with-conditions is her house style.** Nearly every approval reads "Approving under the
  assumption the comments are addressed" / "Approving pending resolution". She trusts people to
  finish, but writes the trust down as a condition.
- **She will un-approve.** "FYI @bhansen-cc, I cleared your approval since there have been
  considerable changes made to this PR since you approved it." (web #99)
- **PR hygiene is enforced**: the project's title convention (type, ticket id, description), one ticket per
  repository, screenshots for visual changes, PR description kept in sync with the code, correct
  target branch.
- **Code comments are for the code, not the PR.** "Code comments should not be used for PR context." (#215)
- **AI output gets adjudicated, not deferred to.** "This is literally the point of this PR. 🤦🏻"
  (#246, swatting a Copilot comment on her own PR); "I agree with Copilot here" (#487); "Copilot is
  wrong here" (#467); "I don't trust that Claude is doing the right thing here" (#461) — all with
  equal ease. She reviewed an AI-generated skills PR by pointing out it documented frameworks the
  repo doesn't use (#343).

## 5. Tone and interpersonal style

- **Direct, never harsh.** The blunt lines ("This is just wrong.", "This is a useless comment.") are
  aimed at code — and disproportionately at her own.
- **Emoji carry real meaning.** 🤷🏻 = optional, take it or leave it. 🤦🏻 = my mistake. 😅/😆 =
  defusing. 😬 = known compromise we're accepting. 🎉 = genuine praise. Read them as tone markers.
- **She apologizes readily and specifically.** "Sorry, I didn't realize this PR was still in Draft
  before I reviewed it." (#395) · "Sorry for not thinking of it myself when updating the ticket. 😞"
  (#329) · "Sorry to be annoying, but this filename should be plural." (web #99)
- **She changes her mind in public and credits the other person.** "I think we should take Fredo's
  suggestion here." (#329) · "Thanks for the clarification, I knew I was missing something." (web #880)
  · "Oh right! Nevermind, then. 😅" (#69)
- **Praise is sparing and concrete.** "Nice job on setting the semantic AI color tokens here. 🎉"
  (#314) · "The new page looks so much better than the old one. This is exciting!" (web #880)
- **She teaches rather than instructs.** A large share of comments carry a runnable snippet, a link
  to Mantine/MDN/React Router docs, or step-by-step instructions (how to build a local `.tgz` and
  install it into the app, #303). She checks out other people's branches, debugs them herself and
  reports back ("I pulled the latest, and computed style doesn't work the way we want", #334).
- **Anti-authority framing.** Near-universal "we"; hedges like "my gut tells me", "I keep going back
  and forth as to which is better or how much I care"; explicit invitations to disagree ("if you
  think that's silly, I can revert that").

## 6. Things she is visibly tired of

- Hand-editing generated token files / not running `build:tokens`.
- `argTypes` in stories that should be inferred from TypeScript types.
- Props re-declared that already exist on `BaseProps` (the same one-line comment five times in a row
  on #385, then again on #380 and #378).
- `:global` selectors and `!important`.
- Third-party libraries shipping AMD/UMD in 2026 ("Part of the joys of dealing with third parties",
  web #813) and AG Grid generally ("AG Grid is a disaster so nothing surprises me. 😬", #316).
- Legacy z-index in the Backbone app, which she works around rather than fixes — and says so.

## 7. How to get a clean review from her

1. Run `npm run build:tokens` and commit the generated output; never hand-edit it.
2. Localize every string and `aria-label`; never concatenate translated fragments.
3. Delete anything `BaseProps`/`BaseInputProps` already provides; spread everything you don't transform.
4. Put docs in JSDoc on the *exported* symbol and use `<Description />` / `<Stories />`.
5. Prefer Mantine vars / `useProps` / compound components over CSS overrides. No `:global`, no `!important`.
6. Any hardcoded value: tokenize it, or say in the PR why you can't.
7. Route visual/UX questions to UX before she has to.
8. File a ticket for anything deferred and reference it in a TODO.
9. Answer her questions with reasoning. "Because X" lands well; a silent force-push does not.
