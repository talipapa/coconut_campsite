<?php
namespace App\CustomVendors;

use Exception;
use GlennRaya\Xendivel\XenditApi;
use Illuminate\Support\Str;

class Xendivel extends XenditApi{

    public static function payWithEwallet($payload): self
    {
        if (config('xendivel.auto_id')
            ? $payload['reference_id'] = Str::orderedUuid()
            : $payload['reference_id']) {
        }

        // $payload = $payload->toArray();

        $response = XenditApi::api('post', '/ewallets/charges', $payload);

        if ($response->failed()) {
            throw new Exception($response);
        }

        return new self();
    }
}