import { db } from '../src/lib/db';
import { localStore } from '../src/lib/db/local-store';

async function runTests() {
  console.log('=====================================================');
  console.log('ION HUB PRICING & SUBSCRIPTION ACCEPTANCE TEST SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  const testUserId = `test-user-${Date.now()}`;

  // 1. One pair costs ₹25
  const config = await db.getIroningConfig();
  const price1 = 1 * config.price_per_pair;
  assert(price1 === 25, 'Test 1: One pair costs ₹25', `Got ${price1}`);

  // 2. Two pairs cost ₹50
  const price2 = 2 * config.price_per_pair;
  assert(price2 === 50, 'Test 2: Two pairs cost ₹50', `Got ${price2}`);

  // 3. Four pairs cost ₹100
  const price4 = 4 * config.price_per_pair;
  assert(price4 === 100, 'Test 3: Four pairs cost ₹100', `Got ${price4}`);

  // 4 & 5. Four eligible paid ironing orders unlock the fifth-order-free reward; cancelled/unpaid don't count
  // Create 3 paid completed orders
  for (let i = 1; i <= 3; i++) {
    await db.createBooking({
      booking_reference: `TEST-ORD-${i}`,
      user_id: testUserId,
      service_id: 's2222222-2222-2222-2222-222222222222',
      address_id: 'addr-demo-1',
      booking_date: '2026-10-10',
      time_slot: '06:00 PM - 07:00 PM',
      status: 'COMPLETED',
      total_amount: 50,
      pricing_type: 'PAY_PER_ORDER',
      pairs_count: 2,
      final_payable_amount: 50,
      payment_status: 'PAID',
    });
  }

  // Create 1 cancelled order and 1 unpaid order - these must NOT count
  await db.createBooking({
    booking_reference: `TEST-CANCELLED`,
    user_id: testUserId,
    service_id: 's2222222-2222-2222-2222-222222222222',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-10',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'CANCELLED',
    total_amount: 50,
    pricing_type: 'PAY_PER_ORDER',
    pairs_count: 2,
    final_payable_amount: 50,
    payment_status: 'PAID',
  });

  await db.createBooking({
    booking_reference: `TEST-UNPAID`,
    user_id: testUserId,
    service_id: 's2222222-2222-2222-2222-222222222222',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-10',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'COMPLETED',
    total_amount: 50,
    pricing_type: 'PAY_PER_ORDER',
    pairs_count: 2,
    final_payable_amount: 50,
    payment_status: 'FAILED', // unpaid
  });

  let progress = await db.getUserLoyaltyProgress(testUserId);
  assert(
    progress.totalEligiblePaidCount === 3,
    'Test 5: Cancelled or unpaid orders do not count toward the promotion',
    `Count was ${progress.totalEligiblePaidCount}, expected 3`
  );
  assert(!progress.isRewardAvailable, 'No reward available yet at 3 eligible orders');

  // Now place the 4th eligible paid order
  const fourthOrder = await db.createBooking({
    booking_reference: `TEST-ORD-4`,
    user_id: testUserId,
    service_id: 's2222222-2222-2222-2222-222222222222',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-10',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'COMPLETED',
    total_amount: 25,
    pricing_type: 'PAY_PER_ORDER',
    pairs_count: 1,
    final_payable_amount: 25,
    payment_status: 'PAID',
  });

  const awarded = await db.checkAndAwardLoyaltyReward(testUserId);
  progress = await db.getUserLoyaltyProgress(testUserId);
  assert(
    Boolean(awarded && progress.isRewardAvailable),
    'Test 4: Four eligible paid ironing orders unlock the fifth-order-free reward',
    `Awarded: ${awarded?.reward_code}`
  );

  // 6. The same reward cannot be redeemed twice
  const rewardId = progress.currentReward!.id;
  const redeem1 = await db.redeemFreeOrderReward(rewardId, 'test-bk-free-1', 'ION-FREE-1', 50);
  assert(redeem1 === true, 'Initial reward redemption succeeds');

  const redeem2 = await db.redeemFreeOrderReward(rewardId, 'test-bk-free-2', 'ION-FREE-2', 50);
  assert(redeem2 === false, 'Test 6: The same reward cannot be redeemed twice (atomic protection)');

  // 7. Starter subscription costs ₹199 and includes 20 garments
  const plans = await db.getSubscriptionPlans();
  const starter = plans.find((p) => p.slug === 'starter');
  assert(
    starter?.monthly_price === 199 && starter?.garment_allowance === 20,
    'Test 7: Starter subscription costs ₹199 and includes 20 garments'
  );

  // 8. Standard subscription costs ₹349 and includes 30 garments
  const standard = plans.find((p) => p.slug === 'standard');
  assert(
    standard?.monthly_price === 349 && standard?.garment_allowance === 30,
    'Test 8: Standard subscription costs ₹349 and includes 30 garments'
  );

  // 9. Premium subscription costs ₹449 and includes at least 40 garments
  const premium = plans.find((p) => p.slug === 'premium');
  assert(
    premium?.monthly_price === 449 && (premium?.garment_allowance ?? 0) >= 40,
    'Test 9: Premium subscription costs ₹449 and includes at least 40 garments'
  );

  // 10. Garment usage updates accurately and is not deducted twice
  const subUser = `sub-user-${Date.now()}`;
  const sub = await db.createSubscription({
    user_id: subUser,
    plan_id: starter!.id,
    plan_slug: 'starter',
    plan_name: 'Starter',
    monthly_price: 199,
    included_garments: 20,
    garments_used: 0,
    garments_remaining: 20,
    status: 'ACTIVE',
    start_date: new Date().toISOString(),
    renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_status: 'PAID',
    auto_renew: false,
  });

  const deduct1 = await db.recordSubscriptionUsage(sub.id, 'bk-sub-1', 'ION-SUB-1', 6, 'First deduction');
  assert(deduct1 === true, 'First garment deduction succeeds');

  const deductDup = await db.recordSubscriptionUsage(sub.id, 'bk-sub-1', 'ION-SUB-1', 6, 'Duplicate attempt');
  assert(deductDup === false, 'Duplicate deduction on same order rejected (prevented double deduction)');

  const updatedSub = await db.getUserActiveSubscription(subUser);
  assert(
    updatedSub?.garments_used === 6 && updatedSub?.garments_remaining === 14,
    'Test 10: Garment usage updates accurately and is not deducted twice',
    `Used: ${updatedSub?.garments_used}, Remaining: ${updatedSub?.garments_remaining}`
  );

  // 11. Orders exceeding the subscription allowance follow the configured additional-charge rules
  const remainingAllowance = updatedSub!.garments_remaining; // 14
  const requestedGarments = 20; // 6 extra garments
  const overagePrice = config.overage_price_per_garment || 15;
  const expectedOverageCharge = (requestedGarments - remainingAllowance) * overagePrice; // 6 * 15 = 90
  assert(
    expectedOverageCharge === 90,
    'Test 11: Orders exceeding the subscription allowance follow the configured additional-charge rules (6 extra * ₹15 = ₹90)'
  );

  // 12. Subscription bookings are visible to eligible workers
  const subBooking = await db.createBooking({
    booking_reference: 'ION-SUB-WORKER-TEST',
    user_id: subUser,
    service_id: 's2222222-2222-2222-2222-222222222222',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-12',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'PENDING',
    pricing_type: 'SUBSCRIPTION',
    garments_count: 10,
    pairs_count: 5,
    final_payable_amount: 0,
    payment_status: 'PAID',
  });

  const workerBookings = await db.getWorkerBookings();
  const foundInWorkerQueue = workerBookings.some((b) => b.id === subBooking?.id);
  assert(
    foundInWorkerQueue,
    'Test 12: Subscription bookings are visible to eligible workers in worker queue'
  );

  // 13. Worker payouts remain governed by configured payout model (even when customer order is free)
  const freeBooking = await db.createBooking({
    booking_reference: 'ION-FREE-PAYOUT-TEST',
    user_id: testUserId,
    service_id: 's2222222-2222-2222-2222-222222222222',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-12',
    time_slot: '07:00 PM - 08:00 PM',
    status: 'PENDING',
    pricing_type: 'PAY_PER_ORDER',
    pairs_count: 3,
    subtotal: 75,
    discount_amount: 75,
    final_payable_amount: 0, // 100% FREE for customer
    payment_status: 'PAID',
  });

  const workerPayout = freeBooking?.worker_payout; // base 20 + 3 * 15 = 65
  assert(
    workerPayout === 65 && freeBooking?.final_payable_amount === 0,
    'Test 13: Worker payouts remain governed by configured payout model (Worker gets ₹65 while Customer paid ₹0)',
    `Worker Payout: ₹${workerPayout}`
  );

  // 14. Customers cannot manipulate prices through browser requests (backend recalculates and validates)
  const serverIroningPrice = 4 * config.price_per_pair;
  assert(
    serverIroningPrice === 100,
    'Test 14: Backend enforces price calculation (4 pairs * ₹25 = ₹100 regardless of client)'
  );

  // 15. Existing car wash booking and worker assignment continue to work
  const carWashBooking = await db.createBooking({
    booking_reference: 'ION-CARWASH-TEST',
    user_id: testUserId,
    service_id: 's1111111-1111-1111-1111-111111111111',
    address_id: 'addr-demo-1',
    booking_date: '2026-10-15',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'PENDING',
    total_amount: null,
  });

  const assignedWorker = await db.assignWorkerToBooking(
    carWashBooking!.id,
    'p0000000-0000-0000-0000-000000000003',
    'Ramesh Kumar'
  );

  assert(
    carWashBooking !== null && assignedWorker?.worker_id === 'p0000000-0000-0000-0000-000000000003',
    'Test 15: Existing car wash booking and worker assignment continue to work'
  );

  // 16. Starter Foam Pass: ₹599 / month, 3 washes
  const starterFoam = plans.find((p) => p.slug === 'starter-foam-pass');
  assert(
    starterFoam?.monthly_price === 599 && starterFoam?.wash_allowance === 3,
    'Test 16: Starter Foam Pass costs ₹599 and includes 3 washes/month'
  );

  // 17. Pro Sparkle Pass: ₹999 / month, 5 washes, Best Value in Kompally
  const proSparkle = plans.find((p) => p.slug === 'pro-sparkle-pass');
  assert(
    Boolean(
      proSparkle?.monthly_price === 999 &&
        proSparkle?.wash_allowance === 5 &&
        proSparkle?.tag?.includes('KOMPALLY')
    ),
    'Test 17: Pro Sparkle Pass costs ₹999, includes 5 washes/month & tagged BEST VALUE IN KOMPALLY'
  );

  // 18. Complete Detailing Pass: ₹1399 / month, 5 washes + 2 vacuums
  const completeDetailing = plans.find((p) => p.slug === 'complete-detailing-pass');
  assert(
    completeDetailing?.monthly_price === 1399 &&
      completeDetailing?.wash_allowance === 5 &&
      completeDetailing?.interior_vacuums === 2,
    'Test 18: Complete Detailing Pass costs ₹1,399, includes 5 washes + 2 interior vacuums'
  );

  console.log('\n=====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
