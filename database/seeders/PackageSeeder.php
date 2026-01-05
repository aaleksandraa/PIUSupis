<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        // PIUS PLUS
        $piusPlus = Package::updateOrCreate(
            ['slug' => 'pius-plus'],
            [
                'name' => 'PIUS PLUS',
                'price' => 1800.00,
                'description' => 'Osnovni paket - 60 dana kompletne edukacije',
                'duration_days' => 60,
                'features' => [
                    '60 dana kompletne edukacije',
                    'Pristup video materijalima',
                    'WhatsApp grupa za podršku',
                    'Sedmični grupni pozivi',
                    'Digitalni certifikat',
                ],
            ]
        );

        $piusPlus->installments()->delete();
        $piusPlus->installments()->createMany([
            [
                'installment_number' => 1,
                'amount' => 400.00,
                'due_description' => 'u roku od 48h od potpisivanja ugovora',
                'due_days' => 2,
            ],
            [
                'installment_number' => 2,
                'amount' => 500.00,
                'due_description' => 'do 01.11.2025',
                'due_date' => '2025-11-01',
            ],
            [
                'installment_number' => 3,
                'amount' => 900.00,
                'due_description' => 'do 01.12.2025',
                'due_date' => '2025-12-01',
            ],
        ]);

        // PIUS PRO
        $piusPro = Package::updateOrCreate(
            ['slug' => 'pius-pro'],
            [
                'name' => 'PIUS PRO',
                'price' => 2500.00,
                'description' => 'Premium paket - 60 dana edukacije + startni paket za rad',
                'duration_days' => 60,
                'features' => [
                    '60 dana kompletne edukacije',
                    'Pristup video materijalima',
                    'WhatsApp grupa za podršku',
                    'Sedmični grupni pozivi',
                    'Digitalni certifikat',
                    'Startni paket za rad: Mašina za PMU, 20 igala, 3 boje, mjerač za obrve, 10 posuda za boju, lateks za vježbanje',
                ],
            ]
        );

        $piusPro->installments()->delete();
        $piusPro->installments()->createMany([
            [
                'installment_number' => 1,
                'amount' => 500.00,
                'due_description' => 'u roku od 48h od potpisivanja ugovora',
                'due_days' => 2,
            ],
            [
                'installment_number' => 2,
                'amount' => 1000.00,
                'due_description' => 'do 01.11.2025',
                'due_date' => '2025-11-01',
            ],
            [
                'installment_number' => 3,
                'amount' => 1000.00,
                'due_description' => 'do 01.12.2025',
                'due_date' => '2025-12-01',
            ],
        ]);
    }
}
