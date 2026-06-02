package expo.modules.yomoneysdk


import android.app.Activity
import android.content.Intent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import ru.yoomoney.sdk.kassa.payments.Checkout.createTokenizationResult
import ru.yoomoney.sdk.kassa.payments.Checkout.createTokenizeIntent
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentMethodType
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentParameters
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.SavePaymentMethod
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.Amount
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.TestParameters
import java.math.BigDecimal
import java.util.Currency


class TokenizeOptions : Record {
  @Field val amount: Double = 0.0
  @Field val currency: String = "RUB"
  @Field val title: String = ""
  @Field val subtitle: String = ""
  @Field val clientApplicationKey: String = ""
  @Field val shopId: String = ""
}
const val REQUEST_CODE = 42069

class YomoneySdkModule : Module() {

  private var pendingPromise: Promise? = null

  override fun definition() = ModuleDefinition {
    Name("YomoneySdk")

    OnActivityResult { activity, payload ->
      when(payload.resultCode){
        Activity.RESULT_OK -> handleActivityResult(payload.data)
        Activity.RESULT_CANCELED -> pendingPromise = null
      }
    }

    AsyncFunction("startTokenize") { options: TokenizeOptions, promise: Promise ->

      val currentActivity = appContext.currentActivity
        ?: return@AsyncFunction promise.reject(Exceptions.MissingActivity())

      if (pendingPromise != null) {
        return@AsyncFunction promise.reject("PENDING_PAYMENT",
          "Another payment process is active", null)
      }

      pendingPromise = promise

      val paymentParameters = PaymentParameters(
        amount = Amount(
          BigDecimal.valueOf(options.amount),
          Currency.getInstance(options.currency)
        ),
        title = options.title,
        subtitle = options.subtitle,
        clientApplicationKey = options.clientApplicationKey,
        shopId = options.shopId,
        savePaymentMethod = SavePaymentMethod.ON,
        paymentMethodTypes = setOf(
          PaymentMethodType.BANK_CARD,
          PaymentMethodType.SBP
        ),
      )

      val intent = createTokenizeIntent(currentActivity,
        paymentParameters,
        TestParameters(showLogs = true))

      currentActivity.startActivityForResult(intent,
        REQUEST_CODE)
    }
  }

  private fun handleActivityResult(data: Intent?) {
    val promise = pendingPromise ?: return
    pendingPromise = null
    if(data != null){
      val result = createTokenizationResult(data)
      val response = mapOf(
        "paymentToken" to result.paymentToken,
        "paymentMethod" to result.paymentMethodType
      )
      promise.resolve(response)
    }
  }
}
