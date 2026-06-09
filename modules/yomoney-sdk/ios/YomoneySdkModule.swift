import ExpoModulesCore


struct TokenizeOptions : Record {
    @Field
    var amount: Double = 0.0

    @Field
    var currency: String = "RUB"

    @Field
    var title: String = ""

    @Field
    var subtitle: String = ""

    @Field
    var clientApplicationKey: String = ""

    @Field
    var shopId: String = ""
}

public class YomoneySdkModule: Module {
    
    private var pendingPromise: Promise?
    private var tokenizationVC: UIViewController?
    
  public func definition() -> ModuleDefinition {
    Name("YomoneySdk")
    
    AsyncFunction("startTokenize") { (options: TokenizeOptions, promise: Promise) in
        
    }
  }
}
