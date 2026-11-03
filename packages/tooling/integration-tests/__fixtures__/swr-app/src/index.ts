// A remote that imports every entry point SWR publishes, so a build of it shows whether the shared
// configs federate all of them or leave some to be bundled privately.
//
// Importing all five matters: SWR holds its cache and revalidation registry behind each entry point
// separately, so one left unshared carries a second copy of that state and `mutate()` stops crossing
// between frontend modules. The `swr` import especially — it was the one the old config left out.
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';
import useSWRSubscription from 'swr/subscription';

export function startupApp() {
  return [useSWR, useSWRImmutable, useSWRInfinite, useSWRMutation, useSWRSubscription].map((hook) => typeof hook);
}
