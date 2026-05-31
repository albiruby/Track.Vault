export type WorkoutDistanceNavItem = {
 id: string;
 label: string;
 order: number;
 primaryDistances?: string[];
 fallbackTargetDistances?: string[];
 fallbackSurfaces?: string[];
 match?: string;
};

export type DistanceNavItem = WorkoutDistanceNavItem;

export const WORKOUT_DISTANCE_NAV: WorkoutDistanceNavItem[] = [
 {
 "id": "all",
 "label": "All Workouts",
 "order": 0,
 "match": "all"
 },
 {
 "id": "100m",
 "label": "100m",
 "order": 1,
 "primaryDistances": [
 "100m"
 ]
 },
 {
 "id": "200m",
 "label": "200m",
 "order": 2,
 "primaryDistances": [
 "200m"
 ]
 },
 {
 "id": "400m",
 "label": "400m",
 "order": 3,
 "primaryDistances": [
 "400m"
 ]
 },
 {
 "id": "800m",
 "label": "800m",
 "order": 4,
 "primaryDistances": [
 "800m"
 ]
 },
 {
 "id": "1500m",
 "label": "1500m",
 "order": 5,
 "primaryDistances": [
 "1500m"
 ]
 },
 {
 "id": "mile",
 "label": "Mile",
 "order": 6,
 "primaryDistances": [
 "Mile"
 ]
 },
 {
 "id": "3k",
 "label": "3K",
 "order": 7,
 "primaryDistances": [
 "3K"
 ]
 },
 {
 "id": "5k",
 "label": "5K",
 "order": 8,
 "primaryDistances": [
 "5K"
 ]
 },
 {
 "id": "10k",
 "label": "10K",
 "order": 9,
 "primaryDistances": [
 "10K"
 ]
 },
 {
 "id": "half-marathon",
 "label": "Half Marathon",
 "order": 10,
 "primaryDistances": [
 "Half Marathon"
 ]
 },
 {
 "id": "marathon",
 "label": "Marathon",
 "order": 11,
 "primaryDistances": [
 "Marathon"
 ]
 },
 {
 "id": "trail",
 "label": "Trail",
 "order": 12,
 "primaryDistances": [
 "Trail"
 ],
 "fallbackTargetDistances": [
 "Trail"
 ]
 },
 {
 "id": "treadmill",
 "label": "Treadmill",
 "order": 13,
 "primaryDistances": [
 "Treadmill"
 ],
 "fallbackSurfaces": [
 "treadmill"
 ]
 },
 {
 "id": "base-recovery",
 "label": "Base / Recovery",
 "order": 14,
 "primaryDistances": [
 "Base",
 "Recovery"
 ],
 "fallbackTargetDistances": [
 "Base",
 "Recovery"
 ]
 },
 {
 "id": "general",
 "label": "General",
 "order": 15,
 "primaryDistances": [
 "General"
 ]
 }
];

export const WORKOUT_DISTANCE_NAV_IDS = WORKOUT_DISTANCE_NAV.map((item) => item.id);
