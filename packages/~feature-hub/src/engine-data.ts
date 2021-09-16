export interface CompatibilityInfo
{
    readonly version:       EngineVersion;
    readonly featureName:   string;
}

export interface EngineEntry
{
    readonly family:            string;
    readonly compatibilities:   readonly CompatibilityInfo[];
}

export type EngineVersion =
Readonly<
    ({ value: string; } | { from: string; to?: string; }) &
    ({ } | { tag: string; shortTag: string; })
>;

export type VersionInfo = EngineVersion | string | readonly [from: string, to?: string];
