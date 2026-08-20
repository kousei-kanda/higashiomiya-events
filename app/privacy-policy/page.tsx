import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 東大宮商工会 × 学生団体",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <h1 className="text-center font-display font-bold text-2xl sm:text-3xl text-text">
        プライバシーポリシー
      </h1>

      <div className="mt-10 flex flex-col gap-8">
        <section>
          <h2 className="bg-green text-white font-display font-bold text-base sm:text-lg px-5 py-3 rounded-md mb-3">
            個人情報の利用目的
          </h2>
          <p className="text-base sm:text-lg text-text leading-relaxed">
            当サイトでは、お問い合わせの際、名前や電話番号、メールアドレス等の個人情報を入力いただく場合がございます。
            取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
          </p>
        </section>

        <section>
          <h2 className="bg-green text-white font-display font-bold text-base sm:text-lg px-5 py-3 rounded-md mb-3">
            アクセス解析ツールについて
          </h2>
          <p className="text-base sm:text-lg text-text leading-relaxed">
            当ブログでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="bg-green text-white font-display font-bold text-base sm:text-lg px-5 py-3 rounded-md mb-3">
            著作権について
          </h2>
          <p className="text-base sm:text-lg text-text leading-relaxed">
            当サイトで掲載している文章や画像などにつきましては、無断転載することを禁止します。当サイトは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="bg-green text-white font-display font-bold text-base sm:text-lg px-5 py-3 rounded-md mb-3">
            お問い合わせ窓口
          </h2>
          <p className="text-base sm:text-lg text-text leading-relaxed">
            お問い合わせは
            <a
              href="mailto:bv22004@shibaura-it.ac.jp"
              className="text-green underline hover:text-green-dark"
            >
              bv22004@shibaura-it.ac.jp
            </a>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
