/**
 * Off-screen field that people never see or tab to, but form-filling bots do.
 * The API treats any value here as spam (see lib/spam-guard.ts).
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: -10000, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
