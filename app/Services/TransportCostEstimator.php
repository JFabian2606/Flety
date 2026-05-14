<?php

namespace App\Services;

class TransportCostEstimator
{
    private const BASE_FARE = 50000;

    private const PRICE_PER_KM = 2300;

    private const MINIMUM_PROFITABLE_PRICE_PER_KM = 2500;

    public function estimate(
        float|int|string|null $distanceKm,
        float|int|string|null $cargoWeightKg,
        ?string $productType = null,
        ?string $productCategory = null,
    ): ?float
    {
        if ($distanceKm === null || $distanceKm === '' || $cargoWeightKg === null || $cargoWeightKg === '') {
            return null;
        }

        $distanceKm = (float) $distanceKm;
        $cargoWeightKg = (float) $cargoWeightKg;

        if ($distanceKm <= 0 || $cargoWeightKg <= 0) {
            return null;
        }

        $loadPrice = (
            self::BASE_FARE +
            ($distanceKm * self::PRICE_PER_KM) +
            $this->weightPrice($cargoWeightKg)
        ) * $this->productFactor($productCategory, $productType);

        $minimumProfitablePrice = $distanceKm * self::MINIMUM_PROFITABLE_PRICE_PER_KM;
        $estimatedCost = max($loadPrice, $minimumProfitablePrice);

        return (float) (ceil($estimatedCost / 1000) * 1000);
    }

    private function weightPrice(float $cargoWeightKg): float
    {
        if ($cargoWeightKg <= 100) {
            return 15000;
        }

        if ($cargoWeightKg <= 300) {
            return $cargoWeightKg * 35;
        }

        if ($cargoWeightKg <= 700) {
            return $cargoWeightKg * 55;
        }

        return $cargoWeightKg * 70;
    }

    private function productFactor(?string $productCategory, ?string $productType): float
    {
        return match ($productCategory) {
            'sensitive' => 1.05,
            'delicate' => 1.10,
            'very_delicate' => 1.15,
            'resistant' => 1.0,
            default => $this->legacyProductFactor($productType),
        };
    }

    private function legacyProductFactor(?string $productType): float
    {
        $productType = $this->normalize($productType);

        if ($productType === '') {
            return 1.0;
        }

        if ($this->containsAny($productType, [
            'muy delicado',
            'fresa',
            'mora',
            'frambuesa',
            'arandano',
            'uva',
            'flor',
            'flores',
        ])) {
            return 1.15;
        }

        if ($this->containsAny($productType, [
            'delicado',
            'tomate',
            'aguacate',
            'durazno',
            'mango',
            'lechuga',
            'hierbas',
        ])) {
            return 1.10;
        }

        if ($this->containsAny($productType, [
            'sensible',
            'hortaliza',
            'hortalizas',
            'cebolla',
            'platano maduro',
            'banano',
            'fruta',
            'frutas',
        ])) {
            return 1.05;
        }

        return 1.0;
    }

    private function normalize(?string $value): string
    {
        $value = mb_strtolower(trim((string) $value));
        $normalized = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);

        return $normalized === false ? $value : $normalized;
    }

    /**
     * @param array<int, string> $needles
     */
    private function containsAny(string $value, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($value, $needle)) {
                return true;
            }
        }

        return false;
    }
}
